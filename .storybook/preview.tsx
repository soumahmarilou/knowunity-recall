import type { Preview } from '@storybook/nextjs-vite'
import { themes } from 'storybook/theming'
import './preview.css'

// The prototype is a fixed 390px-wide mobile screen. Storybook's
// built-in viewport presets don't include a 390px option by default,
// so this defines one matching the app's actual screen width.
const MOBILE_VIEWPORT = 'mobile390'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // Autodocs pages (the auto-generated documentation view, e.g. a
    // page full of color swatches) get room to breathe — they are
    // not bound by the viewport setting below, so this only affects
    // the "layout" (padding) around embedded stories inside docs.
    docs: {
      story: {
        inline: true,
      },
      // Without this, the docs page's own "preview card" frames (the
      // box drawn around each live component example) default to a
      // light background no matter what the component itself renders,
      // which would break the dark-mode-only rule on every docs page.
      theme: themes.dark,
    },

    // The single component-story viewport, matching the prototype's
    // fixed screen width. Named "mobile390" since none of Storybook's
    // built-in presets are exactly 390px wide.
    viewport: {
      options: {
        [MOBILE_VIEWPORT]: {
          name: 'Prototype (390px)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },

  // Sets the default "device frame" every component story previews
  // in — 390px wide, matching the real prototype's screen size.
  // A designer can still switch it from the toolbar in the canvas
  // view; this only sets what loads first.
  initialGlobals: {
    viewport: { value: MOBILE_VIEWPORT, isRotated: false },
  },
};

export default preview;