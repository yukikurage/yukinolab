import Section from "@/components/Section";
import Card from "@/components/Card";
import Image from "next/image";

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
            <Image
              src="/yukikurage-header.png"
              alt="yukikurage のヘッダー画像"
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover dark:hidden"
              priority
            />
            <Image
              src="/yukikurage-header-dark.png"
              alt="yukikurage のヘッダー画像（ダークモード）"
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover hidden dark:block"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div>
              <h3 className="font-card text-2xl font-bold mb-4 text-text">
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
              <h3 className="font-card text-xl font-bold mb-3 text-text">
                リンク
              </h3>
              <div className="flex flex-row gap-4">
                <div className="flex gap-4">
                  <a
                    href="https://x.com/yukikurage_2019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-text text-bg rounded-lg hover:bg-text-secondary transition-colors"
                    aria-label="Twitter (X) でフォローする"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter (X)
                  </a>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/yukikurage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#24292f] dark:bg-white text-white dark:text-[#24292f] rounded-lg hover:bg-text-secondary transition-colors"
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
