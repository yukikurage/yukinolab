import Section from "@/components/Section";
import Card from "@/components/Card";

export default function AboutSection() {
  return (
    <Section id="about" title="ABOUT">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card
          data-text-region
          clickable={false}
          className="w-full overflow-hidden p-0"
        >
          {/* Header Image */}
          <div className="w-full aspect-[6/1] bg-gradient-to-r from-primary-light to-primary-dark relative overflow-hidden">
            <img
              src="/yukikurage-header.png"
              alt="yukikurage header"
              className="w-full h-full object-cover dark:hidden"
            />
            <img
              src="/yukikurage-header-dark.png"
              alt="yukikurage header dark"
              className="w-full h-full object-cover hidden dark:block"
            />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div>
              <h3 className="font-title text-2xl font-bold mb-4 text-text">
                制作者
              </h3>
              <p className="text-text-secondary mb-4">
                <span className="font-semibold">yukikurage</span>
              </p>
              <p className="text-text-secondary leading-relaxed">
                ゲーム制作・Web制作が得意。イラストや曲も時々作る。東京に生息。
              </p>
              <p className="text-text-secondary leading-relaxed">
                Slay the Spire が大好き。
              </p>
            </div>

            <div>
              <h3 className="font-title text-xl font-bold mb-3 text-text">
                SNS
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://x.com/yukikurage_2019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-text text-bg rounded-lg hover:bg-text-secondary transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter (X)
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
