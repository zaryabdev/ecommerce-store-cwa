interface ContainerProps {
  children: React.ReactNode;
}

/**
 * Shared max-width wrapper.
 *
 * Horizontal padding is intentionally NOT centralized here. Every consuming
 * route already applies its own `px-4 sm:px-6 lg:px-8` padding consistently
 * (navbar, home, category, product, cart pages) — adding padding at this
 * level too would double up spacing on every existing page. Centralizing
 * that padding here is a reasonable follow-up once those page files are
 * themselves redesigned; it's out of scope for this foundation-only pass,
 * which leaves page-level layout untouched.
 */
const Container: React.FC<ContainerProps> = ({
  children
}) => {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {children}
    </div>
   );
};

export default Container;
