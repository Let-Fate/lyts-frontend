import { Textarea } from "./ui/textarea";

export default function ResponseBox({ value }: { value: string }) {
    return <Textarea placeholder="" disabled value={value} />
}