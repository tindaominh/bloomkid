import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressDots } from '../ProgressDots';

describe('ProgressDots', () => {
  it('renders one dot per total count', () => {
    const { getAllByTestId } = render(<ProgressDots total={5} current={0} />);
    expect(getAllByTestId(/progress-dot/)).toHaveLength(5);
  });

  it('marks the current dot as active', () => {
    const { getByTestId } = render(<ProgressDots total={3} current={1} />);
    const activeDot = getByTestId('progress-dot-1');
    const style = activeDot.props.style;
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flatStyle.opacity).toBe(1);
  });

  it('marks non-current dots as inactive', () => {
    const { getByTestId } = render(<ProgressDots total={3} current={1} />);
    const inactiveDot = getByTestId('progress-dot-0');
    const style = inactiveDot.props.style;
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flatStyle.opacity).toBeLessThan(1);
  });
});
