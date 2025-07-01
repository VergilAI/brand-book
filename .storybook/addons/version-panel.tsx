import React from 'react';
import { addons, types } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { useGlobals } from 'storybook/manager-api';

const ADDON_ID = 'vergil/version-switcher';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'version';

interface VersionInfo {
  id: string;
  name: string;
  description: string;
  releaseDate: string;
  breaking: boolean;
  deprecated?: boolean;
}

export const versions: VersionInfo[] = [
  {
    id: 'v2',
    name: 'Version 2.0',
    description: 'Apple-inspired monochrome system with subtle attention hierarchy',
    releaseDate: '2024-06-30',
    breaking: true
  },
  {
    id: 'v1',
    name: 'Version 1.0 (Legacy)',
    description: 'Original cosmic-purple based system',
    releaseDate: '2024-01-01',
    breaking: false,
    deprecated: true
  }
];

const VersionSwitcher: React.FC = () => {
  const [globals, updateGlobals] = useGlobals();
  const currentVersion = globals[PARAM_KEY] || 'v2';

  const handleVersionChange = (versionId: string) => {
    updateGlobals({
      [PARAM_KEY]: versionId
    });
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'inherit' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>
        Design Token Version
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {versions.map(version => (
          <div
            key={version.id}
            style={{
              padding: '12px',
              border: currentVersion === version.id ? '2px solid #7B00FF' : '1px solid #e5e5e7',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentVersion === version.id ? '#f8f4ff' : 'transparent',
              opacity: version.deprecated ? 0.7 : 1
            }}
            onClick={() => handleVersionChange(version.id)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>
                {version.name}
              </span>
              
              {version.breaking && (
                <span style={{
                  backgroundColor: '#e51c23',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600
                }}>
                  BREAKING
                </span>
              )}
              
              {version.deprecated && (
                <span style={{
                  backgroundColor: '#ffc700',
                  color: '#1d1d1f',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600
                }}>
                  DEPRECATED
                </span>
              )}
            </div>
            
            <p style={{
              margin: '0 0 4px 0',
              fontSize: '12px',
              color: '#636366',
              lineHeight: 1.4
            }}>
              {version.description}
            </p>
            
            <p style={{
              margin: '0',
              fontSize: '11px',
              color: '#8e8e93'
            }}>
              Released: {version.releaseDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Version Switcher',
    render: ({ active, key }) => {
      if (!active) return null;
      
      return (
        <AddonPanel key={key} active={active}>
          <VersionSwitcher />
        </AddonPanel>
      );
    },
  });
});

export { PARAM_KEY };