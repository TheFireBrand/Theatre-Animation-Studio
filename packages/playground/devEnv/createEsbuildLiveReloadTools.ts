import type esbuild from 'esbuild'
import type {IncomingMessage, ServerResponse} from 'http'

export function createEsbuildLiveReloadTools(): {
  handleRequest(req: IncomingMessage, res: ServerResponse): boolean
  hasOpenConnections(): boolean
  esbuildBanner: esbuild.BuildOptions['banner']
} {
  const openResponses = new Set<ServerResponse>()
  return {
    handleRequest(req, res) {
      // If special /esbuild url requested, subscribe clients to changes
      // if (req.url === '/esbuild') {
      //   res.writeHead(200, {
      //     'Content-Type': 'text/event-stream',
      //     'Cache-Control': 'no-cache',
      //     Connection: 'keep-alive',
      //   })
      //   res.write('data: open\n\n')
      //   openResponses.add(res)
      //   res.on('close', () => openResponses.delete(res))
      //   return true // handled
      // }
      return false
    },
    hasOpenConnections() {
      return openResponses.size > 0
    },
    esbuildBanner: {
      // Below uses function toString to insert raw source code of the function into the JS source.
      // This is being used so we can at least get a few type completions, but please understand that
      // you cannot reference any non-global browser values from within the function.
      js: `;(${function liveReloadClientSetup() {
        console.log('%cLive reload enabled', 'color: gray')
        // from packages/playground/devEnv/createEsbuildLiveReloadTools.ts
        function connect() {
          if (window.parent !== window) {
            console.log(
              '%cLive reload disabled for iframed content',
              'color: gray',
            )
          }
          try {
            const es = new EventSource('/esbuild')
            es.addEventListener('change', () => {
              console.log('%cLive reload triggered', 'color: gray')
              window.location.reload()
            })
          } catch (err) {
            attemptConnect()
          }
        }
        function attemptConnect() {
          setTimeout(() => connect(), 1000)
        }
        attemptConnect()
      }.toString()})();`,
    },
  }
}
