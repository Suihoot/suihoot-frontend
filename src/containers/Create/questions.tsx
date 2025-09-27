import { Button } from "@/components/ui/button";

interface QuestionsProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export default function Questions({ questions, setQuestions }: QuestionsProps) {
  return (
    <div className="flex flex-col gap-2 border-2 border-gray-700 p-2">
      {questions.map((question, index) => (
        <div key={index} className="flex flex-col gap-1">
          <h3 className="text-xl">Question {index + 1}:</h3>
          <input
            type="text"
            placeholder="Question text"
            value={question.text}
            onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[index].text = e.target.value;
              setQuestions(newQuestions);
            }}
            className="border-1 border-black"
          />
          <div className="flex flex-col gap-2 mt-2">
            {question.options.map((option, optionIndex) => (
              <div className="flex items-center gap-2" key={optionIndex}>
                <input
                  type="checkbox"
                  name={`correctOption-${index}`}
                  checked={question.correctOptionsIndex.includes(optionIndex)}
                  onChange={() => {
                    const newQuestions = [...questions];
                    if (newQuestions[index].correctOptionsIndex.includes(optionIndex)) {
                      newQuestions[index].correctOptionsIndex = newQuestions[index].correctOptionsIndex.filter(
                        (i) => i !== optionIndex
                      );
                    } else {
                      newQuestions[index].correctOptionsIndex.push(optionIndex);
                    }
                    setQuestions(newQuestions);
                  }}
                />
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].options[optionIndex] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
                <Button
                  onClick={() => {
                    const newQuestions = [...questions];
                    newQuestions[index].options.splice(optionIndex, 1);
                    if (newQuestions[index].correctOptionsIndex.includes(optionIndex)) {
                      newQuestions[index].correctOptionsIndex = newQuestions[index].correctOptionsIndex.filter(
                        (i) => i !== optionIndex
                      );
                    } else {
                      newQuestions[index].correctOptionsIndex.push(optionIndex);
                    }
                    setQuestions(newQuestions);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
            <Button
              onClick={() => {
                const newQuestions = [...questions];
                newQuestions[index].options.push("");
                setQuestions(newQuestions);
              }}
            >
              Add Option
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
