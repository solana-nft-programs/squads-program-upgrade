import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import dotenv from 'dotenv'

dotenv.config()

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_NETWORK-URL'] = 'https://api.devnet.solana.com'
  process.env['INPUT_PROGRAM-MULTISIG'] =
    '8QC4Lv3YNAHUmacepqxBKCJY5zx7yrDtQLo9sNFsNnqB'
  process.env['INPUT_PROGRAM-ID'] =
    'prgCo6HJ2bP8xPJ3zwVnfVbqhBbBgY8t7moykr7wzCx'
  process.env['INPUT_PROGRAM-INDEX'] = '1'
  process.env['INPUT_BUFFER'] = '3eoQzgrBcpVCRUksfTYRh7xJUcq1XwwgycT5AXUQmu1f'
  process.env['INPUT_SPILL-ADDRESS'] =
    'depThGTDB9Krh5wd3u23Fbr7gtNVn43X5VLr7c2jbew'
  process.env['INPUT_AUTHORITY'] =
    '7CLWzQ3pGwk9TCBnNFVq2p79NGQ8WyhSrrjfXiPN4L9m'
  process.env['INPUT_NAME'] = 'TEST'
  process.env['INPUT_KEYPAIR'] = process.env.DEPLOYER_KEYPAIR
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
