import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography, colors } from '../index';

interface TypographyProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyM',
  color = colors.black,
  style,
  children,
  ...props
}) => {
  const variantStyle = typography[variant];

  return (
    <Text
      style={[
        variantStyle,
        { color },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// 편의를 위한 사전 정의된 컴포넌트들
// Heading
export const HeadingL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headingL" {...props} />
);

export const HeadingM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headingM" {...props} />
);

export const HeadingS: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headingS" {...props} />
);

// Title
export const TitleXL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleXL" {...props} />
);

export const TitleL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleL" {...props} />
);

// Label
export const LabelM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelM" {...props} />
);

export const LabelS: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelS" {...props} />
);

// Body
export const BodyXL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyXL" {...props} />
);

export const BodyL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyL" {...props} />
);

export const BodyM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyM" {...props} />
);

export const BodyS: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyS" {...props} />
);

// Caption
export const CaptionBL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="captionBL" {...props} />
);

export const CaptionBM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="captionBM" {...props} />
);

export const CaptionL: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="captionL" {...props} />
);

export const CaptionM: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="captionM" {...props} />
); 