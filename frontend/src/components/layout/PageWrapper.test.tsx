import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from './PageWrapper';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={`btn ${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}));

describe('PageWrapper', () => {
  const mockBack = jest.fn();
  const mockRouter = {
    back: mockBack,
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders children correctly', () => {
    render(
      <PageWrapper>
        <div>Test Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <PageWrapper title="Test Title">
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
  });

  it('renders subtitle when provided', () => {
    render(
      <PageWrapper title="Main Title" subtitle="Sub Title">
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Sub Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Sub Title');
  });

  it('renders description when provided', () => {
    render(
      <PageWrapper description="Test description">
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button>Action Button</button>;
    
    render(
      <PageWrapper actions={actions}>
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('shows back button when showBackButton is true', () => {
    render(
      <PageWrapper showBackButton>
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('does not show back button when showBackButton is false', () => {
    render(
      <PageWrapper showBackButton={false}>
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('uses custom back button label when provided', () => {
    render(
      <PageWrapper showBackButton backButtonLabel="Go Back">
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('calls router.back() when back button is clicked and no custom handler provided', () => {
    render(
      <PageWrapper showBackButton>
        <div>Content</div>
      </PageWrapper>
    );

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('calls custom onBackClick handler when provided', () => {
    const customHandler = jest.fn();
    render(
      <PageWrapper showBackButton onBackClick={customHandler}>
        <div>Content</div>
      </PageWrapper>
    );

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('applies fixed 8xl max width class', () => {
    const { container } = render(
      <PageWrapper>
        <div>Content</div>
      </PageWrapper>
    );

    expect(container.firstChild).toHaveClass('max-w-8xl');
  });

  it('uses no padding by default', () => {
    const { container } = render(
      <PageWrapper>
        <div>Content</div>
      </PageWrapper>
    );

    expect(container.firstChild).not.toHaveClass('px-4', 'py-2', 'px-6', 'py-4', 'px-8', 'py-6', 'px-12', 'py-8');
  });

  it('applies centering by default', () => {
    const { container } = render(
      <PageWrapper>
        <div>Content</div>
      </PageWrapper>
    );

    expect(container.firstChild).toHaveClass('mx-auto');
  });

  it('can disable centering', () => {
    const { container } = render(
      <PageWrapper center={false}>
        <div>Content</div>
      </PageWrapper>
    );

    expect(container.firstChild).not.toHaveClass('mx-auto');
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageWrapper className="custom-class">
        <div>Content</div>
      </PageWrapper>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders complete page with all elements', () => {
    const actions = <button>Test Action</button>;
    
    render(
      <PageWrapper
        title="Main Title"
        subtitle="Sub Title" 
        description="Page description"
        actions={actions}
        showBreadcrumbs
      >
        <div>Main Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Sub Title')).toBeInTheDocument();
    expect(screen.getByText('Page description')).toBeInTheDocument();
    expect(screen.getByText('Test Action')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders without header when no header props provided', () => {
    render(
      <PageWrapper>
        <div>Only Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Only Content')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('maintains responsive layout structure', () => {
    const { container } = render(
      <PageWrapper title="Test">
        <div>Content</div>
      </PageWrapper>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('w-full', 'max-w-8xl', 'mx-auto');
    
    const contentContainer = wrapper.querySelector('.space-y-6');
    expect(contentContainer).toBeInTheDocument();
  });

  it('handles empty actions gracefully', () => {
    render(
      <PageWrapper title="Test" actions={null}>
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies correct flex layout for header with actions', () => {
    render(
      <PageWrapper 
        title="Test Title"
        actions={<button>Action</button>}
      >
        <div>Content</div>
      </PageWrapper>
    );

    const headerContainer = screen.getByText('Test Title').closest('.flex');
    expect(headerContainer).toHaveClass('flex', 'items-start', 'justify-between', 'gap-4');
  });

  it('uses semantic HTML structure', () => {
    render(
      <PageWrapper title="Main Title" subtitle="Sub Title">
        <div>Content</div>
      </PageWrapper>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Title');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Sub Title');
  });
});