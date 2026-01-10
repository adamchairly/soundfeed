import { text, page, heading } from '@/styles/tailwind';

const PrivacyPage = () => {
  return (
    <div className={`${page.background} ${text.secondary}`}>
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className={`${heading.h1} ${text.primary} mb-16`}>
          Privacy Policy
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className={`${heading.h2} ${text.primary} mb-4`}>
              1. Data Minimization
            </h2>
            <p className="leading-relaxed mb-6">
              Soundfeed does not collect Personally Identifiable Information
              (PII). We do not require names, or OAuth logins. Your email (if
              you add one) isn't tied to your identity.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span>
                  Identifiers:
                  We generate a cryptographic UUID and Recovery Code to store
                  your library.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span>
                    Session Cookies:
                  We use a single, signed functional cookie to maintain your
                  session state.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className={`${heading.h2} ${text.primary} mb-4`}>
              2. Information Usage
            </h2>
            <p className="leading-relaxed">
              Your UUID is used exclusively to associate your followed artists
              with your session. We do not engage in cross-site tracking or the
              sale of user data to third parties.
            </p>
          </section>

          <section>
            <h2 className={`${heading.h2} ${text.primary} mb-4`}>
              3. Third-Party Integration
            </h2>
            <p className="leading-relaxed">
              Music metadata is retrieved via the Spotify API. Soundfeed does
              not transmit your internal identity to Spotify. Your interaction
              with music content is governed by Spotify’s Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className={`${heading.h2} ${text.primary} mb-4`}>
              4. Data Retention & Deletion
            </h2>
            <p className="leading-relaxed">
              Data persists as long as your UUID remains in our database. Due to
              our privacy-centric architecture, if you lose your Recovery Code,
              the associated data becomes permanently orphaned and inaccessible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
