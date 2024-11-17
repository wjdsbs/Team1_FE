import {
  Flex,
  Progress,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { LottieRefCurrentProps } from "lottie-react";
import Lottie from "lottie-react";
import { useRef, useState } from "react";

import { useGetProjectProgress } from "../../../../api/hooks/project.api";
import plantAnimation1 from "../../../../assets/animations/Plant_1.json";
import plantAnimation2 from "../../../../assets/animations/Plant_2.json";
import plantAnimation3 from "../../../../assets/animations/Plant_3.json";
import plantAnimation4 from "../../../../assets/animations/Plant_4.json";
import plantAnimation5 from "../../../../assets/animations/Plant_5.json";
import { useOptionContext } from "../../../../provider/Option";

interface ProgressTreeProps {
  projectId: number;
}

export const ProgressTree = ({ projectId }: ProgressTreeProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { isProjectColorChangeEnabled } = useOptionContext();
  const { data, error, isLoading } = useGetProjectProgress(projectId);
  const growData = data?.resultData;

  const getAnimation = () => {
    if (growData?.projectProgress !== undefined) {
      if (growData.projectProgress === 0) return animationMap[0];
      if (growData.projectProgress <= 25) return animationMap[25];
      if (growData.projectProgress <= 50) return animationMap[50];
      if (growData.projectProgress <= 75) return animationMap[75];
    }
    return animationMap[100];
  };

  const getGrowInfo = () => {
    if (growData?.projectProgress !== undefined) {
      if (growData.projectProgress === 0) return growthLevels[0];
      if (growData.projectProgress <= 25) return growthLevels[25];
      if (growData.projectProgress <= 50) return growthLevels[50];
      if (growData.projectProgress <= 75) return growthLevels[75];
    }
    return growthLevels[100];
  };

  const width = useBreakpointValue({
    base: "70%",
    sm: "150px",
    md: "200px",
    lg: "250px",
  });

  const height = useBreakpointValue({
    base: "70%",
    sm: "150px",
    md: "200px",
    lg: "250px",
  });

  const headerFontSize = useBreakpointValue({
    base: "16px",
    sm: "18px",
    md: "22px",
    lg: "24px",
  });

  const subheaderFontSize = useBreakpointValue({
    base: "14px",
    sm: "16px",
    md: "18px",
    lg: "20px",
  });

  if (error) {
    return <div>프로젝트의 식물을 불러오지 못했습니다.</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClick = () => {
    setIsHovered(true);
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0, true);
      lottieRef.current.play();
    }

    setTimeout(() => {
      setIsHovered(false);
    }, 3000);
  };

  return (
    <Flex
      onClick={handleClick}
      display="inline-block"
      w={"100%"}
      h="auto"
      style={{
        overflow: "hidden",
      }}
      bg="linear-gradient(to top, #EDF2F7, #fff)"
      borderRadius={"50px"}
      cursor={"pointer"}
    >
      <Flex
        flexDir={"column"}
        justifyItems={"flex-start"}
        position="relative"
        height="auto"
        m={5}
        zIndex={2}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? -20 : 10,
          }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            zIndex: 3,
            borderRadius: "lg",
            paddingTop: "5%",
            boxShadow: "md",
            maxWidth: "100%",
            transform: "translateX(-50%)",
            marginTop: "10px",
          }}
        >
          <Text
            fontSize={headerFontSize}
            fontWeight={"800"}
            whiteSpace="pre-line"
            color="gray.700"
          >
            {getGrowInfo().description}
          </Text>
        </motion.div>

        <VStack>
          <Flex
            justifyItems={"center"}
            position="relative"
            justifyContent="center"
            alignItems="center"
            w="100%"
            h="100%"
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={getAnimation()}
              loop={false}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
              }}
              style={{
                width: `${width}`,
                height: `${height}`,
                zIndex: 300,
              }}
            />
          </Flex>

          <Flex direction="column" alignItems="center" width="50%">
            <Flex width="80%" justifyContent="space-between">
              <Text
                fontSize={subheaderFontSize}
                fontWeight="600"
                color="gray.700"
              >
                {getGrowInfo().growthLevel}
              </Text>
              <Text fontSize={subheaderFontSize} fontWeight="600">
                {growData?.projectProgress}%
              </Text>
            </Flex>
            <Progress
              value={growData?.projectProgress}
              size="md"
              width="80%"
              colorScheme={isProjectColorChangeEnabled ? "red" : "blue"}
              bgColor={"white"}
              mt={2}
              borderRadius={"full"}
            />
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  );
};

const animationMap: Record<number, object> = {
  0: plantAnimation1,
  25: plantAnimation2,
  50: plantAnimation3,
  75: plantAnimation4,
  100: plantAnimation5,
};

const growthLevels: Record<
  number,
  { growthLevel: string; description: string }
> = {
  0: {
    growthLevel: "아주 작은 새싹",
    description: "아주 작은 새싹이 보이네요. \n프로젝트를 시작해보세요!",
  },
  25: {
    growthLevel: "작은 새싹",
    description: "아직 작은 새싹이네요. \n본격적으로 프로젝트를 시작해볼까요?",
  },
  50: {
    growthLevel: "새싹",
    description: "새싹이 돋아났어요. \n팀원들과 함께 새싹을 열심히 키워봐요!",
  },
  75: {
    growthLevel: "꽃봉오리",
    description: "꽃봉오리가 생겼어요. \n프로젝트에 더욱더 박차를 가해봐요!",
  },
  100: {
    growthLevel: "만개한 꽃",
    description: "꽃이 활짝 피었어요! \n프로젝트 마무리까지 화이팅!",
  },
};
