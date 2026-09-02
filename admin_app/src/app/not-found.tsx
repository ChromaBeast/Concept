import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center font-sans px-4">
      <div className="w-12 h-12 rounded-2xl bg-ochre/15 border border-ochre/30 text-ochre flex items-center justify-center font-mono font-bold text-lg shadow-sm">
        404
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-paper-text">Page Not Found</h2>
        <p className="text-xs text-paper-muted font-mono">The requested admin route does not exist.</p>
      </div>
      <Link href="/">
        <Button size="sm" variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
}
