import { useState } from "react";
import Timer from "./Timer";
import { useGameshowQuiz } from "../hooks/useGameshowQuiz";

const GamePlayer = ({ game }: any) => {
    const { checkAnswer } = useGameshowQuiz();
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);

    const question = game.questions[idx];
    if (!question) return <div>Finish! Score: {score}</div>;

    const answer = async (optionId: string) => {
        const res = await checkAnswer(game.id, {
            questionId: question.id,
            optionId,
        });

        if (res.correct) setScore((s) => s + question.points);
        setIdx((i) => i + 1);
    };

    return (
        <div>
            <Timer seconds={question.timeLimit} onEnd={() => setIdx(idx + 1)} />
            <h2>{question.text}</h2>

            {question.options.map((o: any) => (
                <button key={o.id} onClick={() => answer(o.id)}>
                    {o.text}
                </button>
            ))}
        </div>
    );
};

export default GamePlayer;
