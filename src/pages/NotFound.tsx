import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { notFoundMeta } from '@/seo/routes';
import { Button } from '@/components/ui/Button';

export const NotFound = () => {
  usePageMeta(notFoundMeta());

  return (
    <section className="shell flex min-h-[72svh] flex-col justify-center py-32">
      <p className="text-[0.75rem] text-ink/45">404</p>
      <h1 className="display-xl mt-3 max-w-[14ch]">This layer is missing.</h1>
      <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink/65">
        The page may have moved, or it may never have existed. The atlas is a better place to
        start again.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button as={Link} to="/" variant="primary">
          Discover
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </Button>
        <Button as={Link} to="/explore" variant="outline">
          Explore the atlas
        </Button>
      </div>
    </section>
  );
};
