export const TextListView: React.FC<{ text?: string }> = ({ text }) => {
    return (
        <span>
            {text && text?.split("--").length > 1
                ? text?.split("--").map((line, index, array) => {
                      if (line) {
                          return (
                              <>
                                  <span>• {line}</span>
                                  {index !== array.length - 1 && <br />}
                              </>
                          );
                      }
                  })
                : text}
        </span>
    );
};
