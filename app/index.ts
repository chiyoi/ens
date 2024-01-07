import { withAuth } from '@/src/auth'
import { handleGetName, handleResolveName, handleSetName } from '@/src/names'
import { Router, error } from 'itty-router'

export default {
  fetch: async (request: Request, env: Env, ctx: ExecutionContext) => router()
    .handle(request, env, ctx)
    .catch(error)
}

const router = () => {
  const router = Router()
  router.all('/ping', () => new Response('Pong!'))
  router.get('/', () => Response.redirect('https://github.com/chiyoi/ens', 307))
  router.get('/ens/:name/address', handleResolveName)
  router.get('/ens/:address/name', handleGetName)
  router.put('/ens/:address/name', withAuth, handleSetName)
  router.all('*', () => error(404, 'Endpoint not exist.'))
  return router
}

export type Env = {
  ens: R2Bucket,
}
