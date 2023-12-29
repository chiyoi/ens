import { withAuth } from '@/src/auth'
import { getName, resolveName, setName } from '@/src/names'
import { Router, error } from 'itty-router'

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => router()
    .handle(request, env, ctx)
    .catch(error)
}

function router() {
  const router = Router()
  router.all('/ping', () => new Response('Pong!'))
  router.get('/', () => Response.redirect('https://github.com/chiyoi/ens', 307))
  router.get('/ens/:name/address', resolveName)
  router.get('/ens/:address/name', getName)
  router.put('/ens/:address/name', withAuth, setName)
  router.all('*', () => error(404, 'Endpoint not exist.'))
  return router
}

export interface Env {
  ens: R2Bucket,
}
