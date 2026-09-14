import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

// Sets Storybook's own tool chrome (sidebar, toolbar) to its dark
// theme, so the tool matches the dark-mode-only prototype it shows.
addons.setConfig({
  theme: themes.dark,
})
