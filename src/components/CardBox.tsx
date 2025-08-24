import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { AnimatePresence, motion } from "motion/react"

interface CardBoxProps {
    currentImage: string[];
    reverse: boolean[];
}

function CardBox(props: CardBoxProps) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <CarouselBox images={props.currentImage} reverse={props.reverse}></CarouselBox>
        </div>
    );
}

interface CarouselBoxProps {
    images: string[];
    reverse: boolean[];
}

function CarouselBox(props: CarouselBoxProps) {
    if (props.images.length > 1) {
        return (
            <Carousel className={"accordion-down"}>
                <CarouselContent>
                    <AnimatePresence>
                        {props.images.map((image, index) => (
                            <motion.div key={index}
                                exit={{ opacity: 0, scale: 0.1 }}
                                initial={{ opacity: 0.7, scale: 3 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 1.5, // 动画持续时间（秒）
                                    ease: "easeInOut", // 缓动曲线
                                }}>
                                <CarouselItem key={index} className="basis-1/3">
                                    <div className="mt-4">
                                        {!props.reverse[index] ?
                                            <img src={image} alt={""} className="object-cover h-60 w-40" />
                                            : <img src={image} alt={""} className="object-cover h-60 w-40 -rotate-180" />}
                                    </div>
                                </CarouselItem>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </CarouselContent>
            </Carousel>
        )
    } else if (props.images.length === 1) {
        return (
            <Carousel className={"accordion-down"}>
                <CarouselContent>
                    <CarouselItem>
                        <div className="mt-4">
                            {!props.reverse[0] ?
                                <img src={props.images[0]} alt={""} className="object-cover h-60 w-40" />
                                : <img src={props.images[0]} alt={""} className="object-cover h-60 w-40 -rotate-180" />}
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        )
    } else {
        return (
            <Carousel className={"accordion-down"}>
                <CarouselContent>
                    <CarouselItem>
                        <div className="mt-4">
                            <img src="/defaultCard.png" className="object-cover h-60 w-40" alt={""} />
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        )
    }
}


export default CardBox;