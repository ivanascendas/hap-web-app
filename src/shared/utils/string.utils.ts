export function getSubstringWithLastWord(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;

    const truncated = str.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex === -1) return truncated;

    return truncated.substring(0, lastSpaceIndex) + ' ...';
}
