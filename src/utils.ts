import {utils} from '@project-serum/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'

export const publicKeyFrom = (s: string, n?: string): PublicKey => {
  try {
    return new PublicKey(s)
  } catch (e) {
    process.stdout.write(`${n ?? 'publicKey'} is not valid publicKey`)
    process.exit(1)
  }
}

export const keypairFrom = (s: string, n?: string): Keypair => {
  try {
    return Keypair.fromSecretKey(utils.bytes.bs58.decode(s))
  } catch (e) {
    try {
      return Keypair.fromSecretKey(
        Buffer.from(
          JSON.parse(
            require('fs').readFileSync(s, {
              encoding: 'utf-8'
            })
          )
        )
      )
    } catch (e) {
      process.stdout.write(`${n ?? 'keypair'} is not valid keypair`)
      process.exit(1)
    }
  }
}
