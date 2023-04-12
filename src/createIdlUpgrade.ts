import {AnchorProvider, BN, Program, Wallet, utils} from '@project-serum/anchor'
import squadsMpl from './idl/squads_mpl.json'
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'
import {msProgramId} from './constants'
import {SquadsMpl} from './idl/squads_mpl'
import {getIDLPDA, getIxPDA, getTxPDA} from './pda'

const SET_IDL_BUFFER_IX_DISCRIMINATOR = '40f4bc78a7e9690a03'
export const createIdlUpgrade = async ({
  multisig,
  programId,
  buffer,
  authority,
  wallet,
  networkUrl
}: {
  multisig: PublicKey
  programId: PublicKey
  buffer: PublicKey
  authority: PublicKey
  wallet: Keypair
  networkUrl: string
}) => {
  const connection = new Connection(networkUrl)
  const program = new Program<SquadsMpl>(
    squadsMpl as SquadsMpl,
    msProgramId,
    new AnchorProvider(
      connection,
      new Wallet(wallet),
      AnchorProvider.defaultOptions()
    )
  )
  const multisigData = await program.account.ms.fetch(multisig)

  console.log(`Creating idl upgrade with
    buffer: ${buffer.toString()},
    multisig: ${multisig.toString()},
    authority: ${authority.toString()},
  `)
  const tx = new Transaction()
  const transactionIndex = new BN(multisigData.transactionIndex + 1, 10)
  const [transactionPDA] = getTxPDA(multisig, transactionIndex, msProgramId)

  // if its > 1 authority, use the derived authority seeds
  const authorityIndex = 1
  const createTransactionIx = await program.methods
    .createTransaction(authorityIndex)
    .accountsStrict({
      multisig,
      transaction: transactionPDA,
      creator: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .instruction()
  tx.add(createTransactionIx)

  // first instruction
  const instructionIndex = 0
  const [instructionPDA] = getIxPDA(
    transactionPDA,
    new BN(instructionIndex, 10),
    msProgramId
  )

  const addInstructionIx = await program.methods
    .addInstruction({
      programId,
      keys: [
        {
          pubkey: buffer,
          isSigner: false,
          isWritable: true
        },
        {
          pubkey: await getIDLPDA(programId),
          isSigner: false,
          isWritable: true
        },
        {
          pubkey: authority,
          isSigner: true,
          isWritable: true
        }
      ],
      data: utils.bytes.hex.decode(`${SET_IDL_BUFFER_IX_DISCRIMINATOR}`)
    })
    .accountsStrict({
      multisig,
      creator: wallet.publicKey,
      transaction: transactionPDA,
      instruction: instructionPDA,
      systemProgram: SystemProgram.programId
    })
    .instruction()
  tx.add(addInstructionIx)

  const activateTransactionIx = await program.methods
    .activateTransaction()
    .accountsStrict({
      multisig,
      transaction: transactionPDA,
      creator: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .instruction()
  tx.add(activateTransactionIx)

  const approveTransactionIx = await program.methods
    .approveTransaction()
    .accountsStrict({
      multisig,
      member: wallet.publicKey,
      transaction: transactionPDA,
      systemProgram: SystemProgram.programId
    })
    .instruction()
  tx.add(approveTransactionIx)

  const txid =
    program.provider.sendAndConfirm &&
    (await program.provider.sendAndConfirm(tx))
  console.log(
    `Successfully created idl upgrade for authority ${authority.toString()} https://explorer.solana.com/tx/${txid}`
  )
  return txid
}
