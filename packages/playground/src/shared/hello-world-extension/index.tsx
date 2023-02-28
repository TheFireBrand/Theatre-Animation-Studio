import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'

studio.extend(extension)
studio.extend({
  id: '@theatre/hello-world-extension',
  toolbars: {
    global(set, studio) {
      let switchValue = 'mobile'
      const updateToolset = () =>
        set([
          {
            type: 'Switch',
            value: switchValue,
            onChange: (value) => {
              switchValue = value
              updateToolset()
            },
            options: [
              {
                value: 'mobile',
                label: 'view mobile version',
                svgSource: '😀',
              },
              {
                value: 'desktop',
                label: 'view desktop version',
                svgSource: '🪢',
              },
            ],
          },
          {
            type: 'Icon',
            title: 'Example Icon',
            svgSource: '👁‍🗨',
            onClick: () => {
              studio.createPane('example')
            },
          },
          {
            type: 'Flyout',
            label: '🫠',
            items: [
              {
                label: 'Item 1',
                onClick: () => {
                  console.log('Item 1 clicked')
                },
              },
              {
                label: 'Item 2',
                onClick: () => {
                  console.log('Item 2 clicked')
                },
              },
              {
                label: 'Item 3',
                onClick: () => {
                  console.log('Item 3 clicked')
                },
              },
              {
                label: 'Item 4',
                onClick: () => {
                  console.log('Item 4 clicked')
                },
              },
            ],
          },
        ])

      updateToolset()

      return () => {
        // remove any listeners if necessary when the extension is unloaded
      }
    },
  },
  panes: [
    {
      class: 'example',
      mount: ({paneId, node}) => {
        studio.ui.renderToolset('global', node)

        return () => {}
      },
    },
  ],
})
studio.initialize()

ReactDOM.render(<App />, document.getElementById('root'))
