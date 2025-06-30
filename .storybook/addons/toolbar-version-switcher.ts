import { addons, types } from '@storybook/manager-api'
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components'
import { useGlobals } from '@storybook/manager-api'
import { styled } from '@storybook/theming'
import React from 'react'
import { versions } from './version-switcher'

const ADDON_ID = 'vergil/toolbar-version-switcher'
const TOOL_ID = `${ADDON_ID}/tool`
const PARAM_KEY = 'version'

const VersionIcon = styled.div`
  width: 14px;
  height: 14px;
  background: #7B00FF;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 9px;
  font-weight: bold;
`

const VersionToolbar = () => {
  const [globals, updateGlobals] = useGlobals()
  const currentVersion = globals[PARAM_KEY] || 'v2'
  const currentVersionInfo = versions.find(v => v.id === currentVersion)

  const handleVersionChange = (versionId: string) => {
    updateGlobals({
      [PARAM_KEY]: versionId
    })
  }

  const versionLinks = versions.map(version => ({
    id: version.id,
    title: version.name,
    value: version.id,
    onClick: () => handleVersionChange(version.id),
    active: currentVersion === version.id,
    right: React.createElement('div', {
      style: {
        display: 'flex',
        gap: '4px',
        alignItems: 'center'
      }
    }, [
      version.breaking && React.createElement('span', {
        key: 'breaking',
        style: {
          backgroundColor: '#e51c23',
          color: 'white',
          padding: '1px 4px',
          borderRadius: '2px',
          fontSize: '8px',
          fontWeight: '600'
        }
      }, 'BREAKING'),
      
      version.deprecated && React.createElement('span', {
        key: 'deprecated',
        style: {
          backgroundColor: '#ffc700',
          color: '#1d1d1f',
          padding: '1px 4px',
          borderRadius: '2px',
          fontSize: '8px',
          fontWeight: '600'
        }
      }, 'DEPRECATED')
    ])
  }))

  return React.createElement(WithTooltip, {
    placement: 'top',
    trigger: 'click',
    closeOnOutsideClick: true,
    tooltip: React.createElement(TooltipLinkList, {
      links: versionLinks
    })
  }, React.createElement(IconButton, {
    key: TOOL_ID,
    title: `Design Token Version: ${currentVersionInfo?.name || 'Unknown'}`,
    style: {
      color: currentVersionInfo?.deprecated ? '#ffc700' : '#7B00FF'
    }
  }, React.createElement(VersionIcon, null, 
    currentVersion.replace('v', '')
  )))
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Version Switcher',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: VersionToolbar,
  })
})

export { PARAM_KEY }