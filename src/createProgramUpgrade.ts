import {AnchorProvider, BN, Program, Wallet} from '@coral-xyz/anchor'
import {ProgramManager} from './idl/program_manager'
import programManager from './idl/program_manager.json'
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram
} from '@solana/web3.js'
import {
  getManagedProgramPDA,
  getProgramManagerPDA,
  getProgramUpgradePDA
} from './pda'
import {programManagerProgramId} from './constants'

export const createProgramUpgrade = async ({
  multisig,
  programId,
  programIndex,
  buffer,
  spill,
  authority,
  name,
  wallet,
  networkUrl
}: {
  multisig: PublicKey
  programId: PublicKey
  programIndex: number
  buffer: PublicKey
  spill: PublicKey
  authority: PublicKey
  name: string
  wallet: Keypair
  networkUrl: string
}) => {
  const connection = new Connection(networkUrl)
  const program = new Program<ProgramManager>(
    programManager as ProgramManager,
    programManagerProgramId,
    new AnchorProvider(
      connection,
      new Wallet(wallet),
      AnchorProvider.defaultOptions()
    )
  )
  const [programManagerPDA] = await getProgramManagerPDA(
    multisig,
    programManagerProgramId
  )
  console.log(`program manager pda: ${programManagerPDA.toString()}`)
  console.log(`program index: ${programIndex}`)
  const [managedProgramPDA] = await getManagedProgramPDA(
    programManagerPDA,
    new BN(programIndex),
    programManagerProgramId
  )
  console.log(`managed program pda: ${managedProgramPDA.toString()}`)
  const managedProgram = await program.account.managedProgram.fetch(
    managedProgramPDA
  )
  if (managedProgram.programAddress.toString() !== programId.toString()) {
    throw new Error('Mismatched program index')
  }
  const [programUpgradePDA] = getProgramUpgradePDA(
    managedProgramPDA,
    new BN(managedProgram.upgradeIndex + 1),
    programManagerProgramId
  )
  console.log(`Creating program upgrade with
    multisig: ${multisig.toString()},
    programManager: ${programManagerPDA.toString()},
    managedProgram: ${managedProgramPDA.toString()},
    programUpgrade: ${programUpgradePDA.toString()}
  `)
  const methods = program.methods
    .createProgramUpgrade(buffer, spill, authority, name)
    .accountsStrict({
      creator: wallet.publicKey,
      multisig,
      programManager: programManagerPDA,
      managedProgram: managedProgramPDA,
      programUpgrade: programUpgradePDA,
      systemProgram: SystemProgram.programId
    })
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: new BN(1000)
      })
    ])
  const txid = await methods.rpc()
  console.log(
    `Successfully created program upgrade for MS_PDA ${multisig.toString()} https://explorer.solana.com/tx/${txid}`
  )
  return txid
}
