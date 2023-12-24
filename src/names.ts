import { IRequest, error, json } from 'itty-router'
import { Env } from '@/src'
import { isHex } from 'viem'

export async function resolveName(request: IRequest, env: Env) {
  const { params: { name } } = request
  const address = await (await env.ens.get(`${name}/address`))?.text()
  if (address === undefined) return error(404, 'Name not exists.')
  return new Response(address)
}

export async function getName(request: IRequest, env: Env) {
  const { params: { address } } = request
  if (!isHex(address)) return error(400, 'Address should be a hex string like `0x${string}`.')
  const name = await (await env.ens.get(`${address}/name`))?.text() ?? ''
  return new Response(name)
}

export async function setName(request: IRequest, env: Env) {
  const { params: { address } } = request
  if (!isHex(address)) return error(400, 'Address should be a hex string like `0x${string}`.')
  const name = await request.text()
  if (name === '') {
    const oldName = await (await env.ens.get(`${address}/name`))?.text()
    oldName !== undefined && await env.ens.delete(`${oldName}/address`)
    await env.ens.delete(`${address}/name`)
  }
  const oldAddress = await (await env.ens.get(`${name}/address`))?.text()
  if (oldAddress !== undefined && oldAddress !== address) return error(409, 'Name is already registered.')
  const oldName = await (await env.ens.get(`${address}/name`))?.text()
  oldName !== undefined && await env.ens.delete(`${oldName}/address`)
  await env.ens.put(`${address}/name`, name)
  await env.ens.put(`${name}/address`, address)
  return json({ set: { name, address } })
}
