import * as core from '@actions/core'
import {createProgramUpgrade} from './createProgramUpgrade'
import {keypairFrom, publicKeyFrom} from './utils'
import {createIdlUpgrade} from './createIdlUpgrade'

async function run(): Promise<void> {
  try {
    const networkUrl: string = core.getInput('network-url')
    const programMultisig: string = core.getInput('program-multisig')
    const programId: string = core.getInput('program-id')
    const programIndex: string = core.getInput('program-index')
    const buffer: string = core.getInput('buffer')
    const spillAddress: string = core.getInput('spill-address')
    const authority: string = core.getInput('authority')
    const name: string = core.getInput('name')
    const keypair: string = core.getInput('keypair')
    const idlBuffer: string = core.getInput('idl-buffer')
    const authorityIndex: string = core.getInput('authority-index')
    core.debug(`start: ${new Date().toLocaleString()}`)
    core.debug(`networkUrl: ${networkUrl}`)
    core.debug(`programMultisig: ${programMultisig}`)
    core.debug(`programId: ${programId}`)
    core.debug(`programIndex: ${programIndex}`)
    core.debug(`buffer: ${buffer}`)
    core.debug(`spillAddress: ${spillAddress}`)
    core.debug(`authority: ${authority}`)
    core.debug(`name: ${name}`)
    core.debug(`idlBuffer: ${idlBuffer}`)
    core.debug(`authorityIndex: ${authorityIndex}`)
    core.debug(`keypair: **********`)

    await createProgramUpgrade({
      multisig: publicKeyFrom(programMultisig, 'programMultisig'),
      programId: publicKeyFrom(programId, 'programId'),
      programIndex: parseInt(programIndex) ?? 1,
      buffer: publicKeyFrom(buffer, 'buffer'),
      spill: publicKeyFrom(spillAddress, 'spillAddress'),
      authority: publicKeyFrom(authority, 'authority'),
      name: name,
      wallet: keypairFrom(keypair, 'keypair'),
      networkUrl: networkUrl
    })

    if (idlBuffer && idlBuffer.length > 0) {
      await createIdlUpgrade({
        multisig: publicKeyFrom(programMultisig, 'programMultisig'),
        programId: publicKeyFrom(programId, 'programId'),
        buffer: publicKeyFrom(buffer, 'buffer'),
        authority: publicKeyFrom(authority, 'authority'),
        wallet: keypairFrom(keypair, 'keypair'),
        networkUrl: networkUrl,
        authorityIndex:
          authorityIndex && authorityIndex.length > 0
            ? parseInt(authorityIndex)
            : 1
      })
    }
  } catch (error) {
    console.log(error)
    core.debug(`error: ${error}`)
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
