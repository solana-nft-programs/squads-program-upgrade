import {utils, BN} from '@project-serum/anchor'
import {PublicKey} from '@solana/web3.js'

export const getMsPDA = (create_key: PublicKey, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('squad'),
      create_key.toBuffer(),
      utils.bytes.utf8.encode('multisig')
    ],
    programId
  )

export const getProgramUpgradePDA = (
  managedProgramPDA: PublicKey,
  upgradeIndexBN: BN,
  programId: PublicKey
) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('squad'),
      managedProgramPDA.toBuffer(),
      upgradeIndexBN.toBuffer('le', 4),
      utils.bytes.utf8.encode('pupgrade')
    ],
    programId
  )

export const getProgramManagerPDA = (msPDA: PublicKey, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('squad'),
      msPDA.toBuffer(),
      utils.bytes.utf8.encode('pmanage')
    ],
    programId
  )

export const getManagedProgramPDA = (
  programManagerPDA: PublicKey,
  managedProgramIndexBN: BN,
  programId: PublicKey
) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('squad'),
      programManagerPDA.toBuffer(),
      managedProgramIndexBN.toBuffer('le', 4),
      utils.bytes.utf8.encode('program')
    ],
    programId
  )

export const getTxPDA = (
  msPDA: PublicKey,
  txIndexBN: BN,
  programId: PublicKey
) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('squad'),
      msPDA.toBuffer(),
      txIndexBN.toArrayLike(Buffer, 'le', 4),
      utils.bytes.utf8.encode('transaction')
    ],
    programId
  )

export const getIxPDA = (
  txPDA: PublicKey,
  iXIndexBN: BN,
  programId: PublicKey
) =>
  PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('squad'),
      txPDA.toBuffer(),
      iXIndexBN.toArrayLike(Buffer, 'le', 1), // note instruction index is an u8 (1 byte)
      utils.bytes.utf8.encode('instruction')
    ],
    programId
  )

export const getIDLPDA = async (programId: PublicKey) => {
  const [base] = PublicKey.findProgramAddressSync([], programId)
  return PublicKey.createWithSeed(base, 'anchor:idl', programId)
}
