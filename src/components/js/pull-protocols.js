export default function pullProtocols(sessionName, text, sessionDate) {
    const REGEX_EXTRACT_EXERCISES = /\[\s*(.*?)\s*:\s*(.*?)\]/gi;
    const REGEX_EXTRACT_EXERCISES_NEW =
        /<div data-type="protocol-item">\s*(.*?)\s*:\s*(.*?)<\/div>/gi;
    const RETURN_PACKETS = [];
    let finderNew;
    while ((finderNew = REGEX_EXTRACT_EXERCISES_NEW.exec(text)) !== null) {
        if (finderNew.index === REGEX_EXTRACT_EXERCISES_NEW.lastIndex) {
            REGEX_EXTRACT_EXERCISES_NEW.lastIndex++;
        }
        const PACKET_BUILDER = {
            sessionName,
            sessionDate,
            exerciseName: null,
            exerciseProtocol: null,
        };
        finderNew.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                PACKET_BUILDER.exerciseName = match.replace(/<[^>]*>?/gim, "");
            } else if (groupIndex === 2) {
                PACKET_BUILDER.exerciseProtocol = match.replace(
                    /<[^>]*>?/gim,
                    ""
                );
            }
        });
        RETURN_PACKETS.push(PACKET_BUILDER);
    }
    let finderOld;
    const HTML_REMOVED_TAGS = text.replace(/<[^>]*>?/gim, "");
    while (
        (finderOld = REGEX_EXTRACT_EXERCISES.exec(HTML_REMOVED_TAGS)) !== null
    ) {
        if (finderOld.index === REGEX_EXTRACT_EXERCISES.lastIndex) {
            REGEX_EXTRACT_EXERCISES.lastIndex++;
        }
        const PACKET_BUILDER = {
            sessionName,
            sessionDate,
            exerciseName: null,
            exerciseProtocol: null,
        };
        finderOld.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                PACKET_BUILDER.exerciseName = match;
            } else if (groupIndex === 2) {
                PACKET_BUILDER.exerciseProtocol = match;
            }
        });
        RETURN_PACKETS.push(PACKET_BUILDER);
    }
    return RETURN_PACKETS;
}
