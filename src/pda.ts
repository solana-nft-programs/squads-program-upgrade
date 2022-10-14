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
