import {
  START_ROUND_BRACKET,
  END_ROUND_BRACKET,
  STRING_WITH_SPACE_SYMBOL,
  BRANCH_END_SYMBOL,
  VERTICAL_LINE_SYMBOL,
} from "../constants/index.js";

export const checkInputValue = (value) => {
  if (!value) {
    return false;
  }

  let openedBracketsAmount = 0;
  let closedBracketsAmount = 0;

  for (let i = 0; i < value.length; i++) {
    if (value[i] === START_ROUND_BRACKET) {
      openedBracketsAmount++;
      continue;
    }

    if (value[i] === END_ROUND_BRACKET) {
      closedBracketsAmount++;
    }
  }

  if (!openedBracketsAmount || !closedBracketsAmount) {
    return false;
  }

  return openedBracketsAmount === closedBracketsAmount;
}

export const getIsNumber = (str) => {
  return /\d/.test(str);
};

export const getFormatedInputValue = (value) => {
  let level = -1;
  let bigNumberStr = "";
  const result = {};
  const parentsByLevel = {};

  for (let i = 0; i < value.length; i++) {
    if (value[i] === START_ROUND_BRACKET) {
      bigNumberStr = "";
      level++;
      continue;
    }

    if (value[i] === END_ROUND_BRACKET) {
      bigNumberStr = "";
      level--;
      continue;
    }

    if (value[i] === STRING_WITH_SPACE_SYMBOL) {
      bigNumberStr = "";
      continue;
    }

    const isNextNumber = getIsNumber(value[i + 1]);

    if (isNextNumber) {
      bigNumberStr += value[i];
      continue;
    }

    bigNumberStr += value[i];

    if (!parentsByLevel[level]) {
      parentsByLevel[level] = [bigNumberStr];
    } else {
      parentsByLevel[level].push(bigNumberStr);
    }

    const parentValue = !parentsByLevel[level - 1]
      ? "0"
      : parentsByLevel[level - 1][parentsByLevel[level - 1].length - 1];

    if (!result[parentValue]) {
      result[parentValue] = [
        {
          value: bigNumberStr,
          level,
          parentValue,
        },
      ];
      continue;
    }

    result[parentValue].push({
      value: bigNumberStr,
      level,
      parentValue,
    });
  }
  return result;
};

export const addSpaces = ({ level, prevRowFull, prevRowPart, skipLine }) => {
  const charByLevel =
    level - 1 > 0 && !skipLine
      ? VERTICAL_LINE_SYMBOL
      : STRING_WITH_SPACE_SYMBOL;
  const additionalSpaces = STRING_WITH_SPACE_SYMBOL.repeat(
    prevRowPart.length - 2 > 0 ? prevRowPart.length - 2 : 0
  );

  const str = prevRowFull.replace(
    prevRowPart,
    `${charByLevel}${additionalSpaces}`
  );
  return str;
};

export const getBranchEnd = ({ hasSubBranch, maxNumberLength, itemLength }) => {
  return `${
    maxNumberLength > itemLength && hasSubBranch
      ? "-".repeat(maxNumberLength - itemLength)
      : ""
  }${hasSubBranch ? BRANCH_END_SYMBOL : ""}`;
};

export const getMaxNumberLength = (arr) => {
  let maxNumberLength = arr[0].value.length;

  for (let i = 0; i < arr.length; i++) {
    if (maxNumberLength < arr[i].value.length) {
      maxNumberLength = arr[i].value.length;
    }
  }

  return maxNumberLength;
};

export const renderBranch = ({
  startBranch,
  branches,
  prevRowFull = "",
  prevRowPart = "",
  isParentLast = false,
}) => {
  const rows = [];
  const maxNumberLength = getMaxNumberLength(startBranch);

  startBranch.forEach((item, idx, arr) => {
    const hasSubBranch = !!branches[item.value];
    const isLast = idx === arr.length - 1;

    const rowPart = `${item.value}${getBranchEnd({
      hasSubBranch,
      maxNumberLength,
      itemLength: item.value.length,
    })}`;

    const rowSpaces = addSpaces({
      level: item.level,
      prevRowFull,
      prevRowPart,
      skipLine: isLast && isParentLast,
    });

    const row = `${rowSpaces}${rowPart}`;

    rows.push(row);

    if (!branches[item.value]?.length) {
      return;
    }

    const subBranches = renderBranch({
      startBranch: branches[item.value] ?? [],
      branches,
      prevRowFull: row,
      prevRowPart: rowPart,
      isParentLast: isLast,
    });

    rows.push(...subBranches);
  });

  return rows;
};
