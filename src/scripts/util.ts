export function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}

export function getRandomFloat(min:number, max:number, decimals:number) {
  const str = (Math.random() * (max - min) + min).toFixed(
    decimals,
  );

  return parseFloat(str);
}

export function RemapRange(value:number, input_start:number, input_end:number, output_start:number, output_end:number) {
	return output_start + ((output_end - output_start) / (input_end - input_start)) * (value - input_start);
}

export function toBool(value:string) {
	if (typeof value === "boolean") return value;
	if (typeof value != "string") return null;
	if (value.toLowerCase() == "true") return true;
	if (value.toLowerCase() == "false") return false;
	return null;
}