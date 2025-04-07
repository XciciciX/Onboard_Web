import Link from 'next/link';

export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300">Pursuit Onboarding</h1>

      <div className="space-y-10 text-white">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Link
              href="/onboarding"
              className="group block space-y-1.5 rounded-lg bg-gray-900 px-5 py-3 hover:bg-gray-800"
            >
              <div className="font-medium text-gray-200 group-hover:text-gray-50">
                Start Onboarding
              </div>
              <div className="line-clamp-3 text-sm text-gray-400 group-hover:text-gray-300">
                Begin the setup process for your Pursuit account
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
