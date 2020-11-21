import { useMemo } from 'react';
import TRenderEngine from '@native-html/transient-render-engine';
import { RenderHTMLProps } from './shared-types';

export default function useTRenderEngine(props: RenderHTMLProps) {
  const {
    allowedStyles,
    ignoredStyles,
    decodeEntities,
    baseStyle,
    classesStyles,
    tagsStyles,
    idsStyles,
    enableCSSInlineProcessing,
    enableUserAgentStyles,
    fallbackFonts,
    systemFonts,
    triggerTREInvalidationPropNames
  } = props;
  const isFontSupported = useMemo(() => {
    const fontMap = {} as Record<string, true>;
    systemFonts!.forEach((font) => {
      fontMap[font] = true;
    });
    return (fontFamily: string) => {
      if (fallbackFonts![fontFamily as keyof typeof fallbackFonts]) {
        return fallbackFonts![fontFamily as keyof typeof fallbackFonts];
      }
      return fontMap[fontFamily] || false;
    };
  }, [systemFonts, fallbackFonts]);
  const tbuilderDeps = (triggerTREInvalidationPropNames || []).map(
    (key) => props[key]
  );
  return useMemo(
    () =>
      new TRenderEngine({
        cssProcessorConfig: {
          isFontSupported,
          inlinePropertiesBlacklist: ignoredStyles,
          inlinePropertiesWhitelist: allowedStyles
        },
        htmlParserOptions: {
          decodeEntities
        },
        stylesConfig: {
          baseStyle,
          enableCSSInlineProcessing,
          enableUserAgentStyles,
          classesStyles,
          idsStyles,
          tagsStyles
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...tbuilderDeps, isFontSupported]
  );
}
