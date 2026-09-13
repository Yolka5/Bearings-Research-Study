import { Hero3D } from "@/components/hero-3d";
import { TopMarquee } from "@/components/top-marquee";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";
import CircularSplitRoll from "@/components/ui/circular-split-roll";
import { BlurReveal } from "@/components/ui/blur-reveal";
import HowItWorks, { type Step } from "@/components/ui/how-it-works";
import SkewCards from "@/components/ui/gradient-card-showcase";

const processSteps = [
  {
    step: "שלב 1",
    title: "בחירת נושא",
    desc: "כל אחד בחר נושא אחד בכיתה.",
    gradientFrom: "#ffbc00",
    gradientTo: "#ff0058",
  },
  {
    step: "שלב 2",
    title: "שאלות",
    desc: "ניסוח שאלות לקראת המחקר.",
    gradientFrom: "#03a9f4",
    gradientTo: "#ff0058",
  },
  {
    step: "שלב 3",
    title: "מחקר",
    desc: "המחקר נמצא כעת בתהליך.",
    gradientFrom: "#4dff03",
    gradientTo: "#00d0ff",
  },
];

const researchQuestions: Step[] = [
  {
    title: "סוגי מיסבים",
    colorTheme: "orange",
    questions: [
      "מהם סוגי המיסבים העיקריים (כדוריים, גליליים, מחטיים, דחיפה, שרוול/בושינג) ומה מבדיל ביניהם מבחינה מכנית?",
      "לאיזה עומסים מיועד כל סוג - רדיאלי, צירי, או משולב - ובאיזה יחס?",
      "אילו סוגים נפוצים במנגנונים בגודל FRC (מודולי סוורב, צירים, צירי סיבוב) ולמה?",
    ],
  },
  {
    title: "איך בוחרים מיסב",
    colorTheme: "blue",
    questions: [
      "איזה סוג עומס ומגניטודה מפעיל היישום - רדיאלי/צירי/משולב, סטטי/דינמי?",
      "באיזה טווח סל\"ד ומחזור עבודה המיסב צריך לשרוד?",
      "כמה דיוק/ריצה חופשית (runout) המנגנון דורש, ואיך זה משפיע על סיווג המיסב?",
      "מה תקציב הנפח/המשקל, ומה הפשרה בין עלות לזמינות עבור קבוצות FRC (מיסבים מוכנים מול מותאמים אישית)?",
    ],
  },
  {
    title: "קיבוע גוף המיסב",
    colorTheme: "purple",
    questions: [
      "אילו סוגי התאמות קיימים בין קדח המיסב/הציר לבין בית המיסב/הקוטר החיצוני (לחיצה, החלקה, מעבר), ומתי משתמשים בכל אחת?",
      "איך מונעים תזוזה צירית של המיסב בתוך הבית שלו (כתפיים, טבעות נעילה, מכסי מיסב)?",
      "אילו סיבולות נדרשות על הציר ועל הבית, ומה קורה אם הן לא מדויקות?",
      "איך התפשטות תרמית משפיעה על בחירת ההתאמה עם חומרים מעורבים (בית אלומיניום + מיסב פלדה)?",
    ],
  },
  {
    title: "חומרי ייצור",
    colorTheme: "orange",
    questions: [
      "ממה עשויים מיסבים בדרך כלל (פלדת כרום, נירוסטה, קרמיקה, דלרין) ומה מכתיב את הבחירה?",
      "איך חומר הבית (אלומיניום מול פלדה מול פלסטיק מודפס בתלת-ממד) משפיע על ההתאמה ועל אורך החיים של המיסב?",
      "אילו גורמים סביבתיים (אבק, לחות, טמפרטורה) דוחפים לכיוון חומר מסוים על פני אחר בתנאי FRC?",
    ],
  },
];

export default function Home() {
  return (
    <main>
      <TopMarquee />
      <Hero3D />
      <ParallaxComponent />
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-12 z-30 flex justify-center px-4">
          <BlurReveal
            as="h2"
            inView
            once
            speedReveal={1.1}
            speedSegment={0.8}
            className="text-center font-medium leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            שאלות למחקר
          </BlurReveal>
        </div>
        <CircularSplitRoll
          radius={500}
          cardSize={205}
          textSideScale={0.68}
          textSideOpacity={0.18}
        />
      </div>
      <HowItWorks features={researchQuestions} />
      <SkewCards items={processSteps} />
    </main>
  );
}
