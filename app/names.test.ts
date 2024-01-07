import { describe, test, expect } from '@jest/globals'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http()
})

describe('main', () => {
  test('set, get, resolve and delete name', async () => {
    const address = account.address
    const name = 'test-name'
    const message = 'Test message.'
    const headers = {
      Authorization: `Signature ${btoa(message)}:${await client.signMessage({ message })}`,
    }

    const setNameResponse = await fetch(`http://localhost:8787/ens/${address}/name`, {
      method: 'PUT',
      headers,
      body: name,
    })
    expect(setNameResponse.ok).toBeTruthy()

    const getNameResponse = await fetch(`http://localhost:8787/ens/${address}/name`)
    expect(setNameResponse.ok).toBeTruthy
    expect(await getNameResponse.text()).toBe(name)

    const resolveNameResponse = await fetch(`http://localhost:8787/ens/${name}/address`)
    expect(resolveNameResponse.ok).toBeTruthy()
    expect(await resolveNameResponse.text()).toBe(address)

    const deleteNameResponse = await fetch(`http://localhost:8787/ens/${address}/name`, {
      method: 'PUT',
      headers,
      body: '',
    })
    expect(deleteNameResponse.ok).toBeTruthy()

    const getNameResponseAfterDelete = await fetch(`http://localhost:8787/ens/${address}/name`)
    expect(getNameResponseAfterDelete.ok).toBeTruthy()
    expect(await getNameResponseAfterDelete.text()).toBe('')

    const resolveNameResponseAfterDelete = await fetch(`http://localhost:8787/ens/${name}/address`)
    expect(resolveNameResponseAfterDelete.status).toBe(404)
  })
})
