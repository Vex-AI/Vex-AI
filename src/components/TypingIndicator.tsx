// components/TypingIndicator.tsx
import { motion } from "framer-motion";
import { IonText } from "@ionic/react";

const TypingIndicator = () => {
    const dotVariants = {
        initial: { opacity: 0.3, y: 0 },
        animate: { opacity: 1, y: -3 }
    };

    return (
        <div
            style={{
                width: "100%",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                height: "20px"
            }}
        >
            {[0, 1, 2].map(index => (
                <motion.div
                    key={index}
                    variants={dotVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                        delay: index * 0.2
                    }}
                    style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#666"
                    }}
                />
            ))}
        </div>
    );
};

export default TypingIndicator;
