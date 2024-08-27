import { bulkInsert } from "@/app/_functions/bulkInset/bulkInsert";
import style from "./bulkInsert.module.scss";
import Button from "@/app/_components/(buttons)/styledButton";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

async function Page() {
    const session = await auth();
    if (!session) return notFound();
    const setId = "1f69995a-5ca6-4680-b45c-3cc69b2d4e2d";

    type DataArray = {
        difficulty: "EASY" | "MEDIUM" | "HARD" | "NA";
        item_question?: string | undefined;
        item_answer?: string | undefined;
        item_tags?: string[] | undefined;
    };

    const dataArray: DataArray[] = [
        {
            difficulty: "EASY",
            item_question:
                "What should you do if you feel tired while driving?",
            item_answer: "Stop at a safe place and rest.",
            item_tags: ["alertness", "fatigue"],
        },
        {
            difficulty: "EASY",
            item_question: "Why is it dangerous to drive if you feel tired?",
            item_answer: "It reduces your concentration and reaction time.",
            item_tags: ["alertness", "fatigue"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "What should you do if you start to feel drowsy while driving on a motorway?",
            item_answer:
                "Leave the motorway at the next exit and find a safe place to rest.",
            item_tags: ["alertness", "motorway"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "How can you avoid becoming tired on a long journey?",
            item_answer: "Take regular breaks, at least every two hours.",
            item_tags: ["alertness", "long journey"],
        },
        {
            difficulty: "EASY",
            item_question: "What should you do before making a U-turn?",
            item_answer: "Look over your shoulder for a final check.",
            item_tags: ["alertness", "manoeuvres"],
        },
        {
            difficulty: "MEDIUM",
            item_question: "When should you avoid taking a long journey?",
            item_answer: "When you're feeling tired.",
            item_tags: ["alertness", "journey planning"],
        },
        {
            difficulty: "HARD",
            item_question:
                "What’s the best way to stay alert while driving at night?",
            item_answer:
                "Ensure your car is well ventilated and take regular breaks.",
            item_tags: ["alertness", "night driving"],
        },
        {
            difficulty: "EASY",
            item_question:
                "How can you help to keep your concentration on long journeys?",
            item_answer: "Take regular rest breaks.",
            item_tags: ["alertness", "concentration"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "Why is it important to plan your journey to avoid busy times?",
            item_answer: "To help avoid stress and reduce tiredness.",
            item_tags: ["alertness", "journey planning"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "What is the recommended minimum break time after driving continuously for two hours?",
            item_answer: "15 minutes.",
            item_tags: ["alertness", "breaks"],
        },
        {
            difficulty: "HARD",
            item_question:
                "What is the purpose of 'rumble strips' on motorways and dual carriageways?",
            item_answer:
                "To alert you to hazards ahead or if you drift off the road.",
            item_tags: ["alertness", "motorways"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "What should you do if your vehicle breaks down on the motorway?",
            item_answer:
                "Pull over to the hard shoulder and use your hazard warning lights.",
            item_tags: ["alertness", "motorways"],
        },
        {
            difficulty: "EASY",
            item_question:
                "Why is it important to stay focused while driving through roadworks?",
            item_answer:
                "Because of the potential hazards and reduced speed limits.",
            item_tags: ["alertness", "roadworks"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "How does driving in heavy rain affect your alertness?",
            item_answer:
                "It requires more concentration due to reduced visibility and slippery roads.",
            item_tags: ["alertness", "weather conditions"],
        },
        {
            difficulty: "HARD",
            item_question:
                "What should you do if you're dazzled by the headlights of an oncoming vehicle at night?",
            item_answer:
                "Slow down or stop if necessary and avoid looking directly at the lights.",
            item_tags: ["alertness", "night driving"],
        },
        {
            difficulty: "EASY",
            item_question:
                "What does it mean if you see a pedestrian with a dog wearing a yellow or burgundy coat?",
            item_answer: "The pedestrian is likely to be deaf.",
            item_tags: ["alertness", "pedestrians"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "What is a common effect of taking medication that may affect your alertness while driving?",
            item_answer: "Drowsiness.",
            item_tags: ["alertness", "medication"],
        },
        {
            difficulty: "HARD",
            item_question:
                "How can you ensure you stay alert on a long motorway journey?",
            item_answer:
                "Take regular breaks, switch drivers if possible, and ensure you get plenty of fresh air.",
            item_tags: ["alertness", "long journey"],
        },
        {
            difficulty: "MEDIUM",
            item_question:
                "What should you do if you feel unwell before starting a journey?",
            item_answer:
                "Delay your journey or make other travel arrangements.",
            item_tags: ["alertness", "health"],
        },
        {
            difficulty: "EASY",
            item_question:
                "Why is it important to use your mirrors regularly while driving?",
            item_answer: "To be aware of what's happening around you.",
            item_tags: ["alertness", "mirror use"],
        },
    ];

    const insertBulkHandler = async () => {
        try {
            await bulkInsert({
                dataArray: dataArray,
                setId: setId,
                userId: session.user.id,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className={style.contentContainer}>
            <div className={style.dataArrayContainer}>
                {dataArray &&
                    dataArray.map((item, index) => (
                        <div
                            className={style.questionAnswerContainer}
                            key={index}
                        >
                            <span>{item.item_question}</span>
                            <span>{item.item_answer}</span>
                        </div>
                    ))}
            </div>
            <Button
                text="Bulk Insert"
                variant="black"
                handler={insertBulkHandler}
            ></Button>
        </section>
    );
}

export default Page;
