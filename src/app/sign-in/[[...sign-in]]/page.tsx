import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero grid-overlay">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black gradient-text mb-2">RMK Dashboard</h1>
          <p className="text-muted text-sm">Sign in to access the admin panel</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-zinc-400',
              formFieldLabel: 'text-zinc-300',
              formFieldInput:
                'bg-zinc-800 border-zinc-700 text-white focus:border-amber-500 focus:ring-amber-500/20',
              formButtonPrimary:
                'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-900 font-bold',
              footerActionLink: 'text-amber-400 hover:text-amber-300',
              identityPreviewEditButton: 'text-amber-400',
              dividerLine: 'bg-zinc-700',
              dividerText: 'text-zinc-500',
              socialButtonsBlockButton:
                'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
              socialButtonsBlockButtonText: 'text-zinc-300',
            },
          }}
        />
      </div>
    </div>
  );
}
