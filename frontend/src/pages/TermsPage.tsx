const TermsPage = () => {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-slate-200 text-slate-600">
        <div className="max-w-2xl mx-auto py-20 px-6">
          <h1 className="text-3xl md:text-5xl tracking-tight text-slate-900 mb-16">
            Terms of Service
          </h1>
  
          <div className="space-y-12">
            <section>
              <h2 className="text-lg font-medium text-slate-900 mb-4">1. Acceptance of Agreement</h2>
              <p className="leading-relaxed">
                By accessing Soundfeed, you agree to be bound by these Terms. If you do not agree to these terms, you must discontinue use of the Service immediately.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-medium text-slate-900 mb-4">2. User Accountability</h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  Soundfeed operates on a decentralized identity model. You are solely responsible for the safekeeping of your recovery code. 
                </p>
                <p className="leading-relaxed">
                  Because we do not store personal identifiers (emails or passwords), Soundfeed is technically unable to recover accounts, reset access, or retrieve artist data if a recovery code is lost.
                </p>
              </div>
            </section>
  
            <section>
              <h2 className="text-lg font-medium text-slate-900 mb-4">3. Intellectual Property</h2>
              <p className="leading-relaxed">
                Soundfeed is an independent tool and is <span className="italic">not affiliated with, endorsed by, or partnered with Spotify</span>. All artist metadata and imagery remain the property of their respective rights holders.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-medium text-slate-900 mb-4">4. Acceptable Use</h2>
              <p className="leading-relaxed">
              You agree not to misuse the Service or assist anyone else in doing so. Specifically, you must not attempt to circumvent security protocols, interfere with service performance, or access data through unauthorized automated means. Any attempt to gain unauthorized access to other users artist feeds is strictly prohibited.
              </p>
            </section>
  
            <section>
              <h2 className="text-lg font-medium text-slate-900 mb-4">5. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                Soundfeed is provided "as-is", with all faults and defects without warranty of any kind
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  };

export default TermsPage;