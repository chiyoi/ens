import { withAuth } from '@/src/auth'
import { getAddressName, resolveName, setAddressName } from '@/src/names'
import { Router, error } from 'itty-router'

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router()
    .handle(request, env, ctx)
    .catch(error)
}

function router() {
  const router = Router()
  router.all('/ping', () => new Response('Pong!'))

  router.get('/ens/:name/address', resolveName)
  router.all('/ens/:name/address', () => error(405, 'Endpoint <Resolve Name> is read-only.'))

  router.get('/ens/:address/name', getAddressName)
  router.put('/ens/:address/name', withAuth, setAddressName)
  router.all('/ens/:address/name', () => error(405, 'Endpoint <Address Name> only supports GET and PUT.'))

  router.all('*', () => error(404, 'Endpoint not exist.'))
  return router
}

export function isHex(s: string): s is `0x${string}` {
  return s.length >= 2 && s[0] === '0' && s[1] === 'x'
}

export interface Env {
  ens: R2Bucket,
}
