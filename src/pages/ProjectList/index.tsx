import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { useGetProjectDates } from "../../api/hooks/useGetProjectDates";
import { useGetProjects } from "../../api/hooks/useGetProjects";
import { ProjectCreatingModal } from "../../components/common/modal/ProjectCreate";
import { ScheduleList } from "../../components/common/ScheduleCard";
import { SearchInput } from "../../components/common/SearchInput/ProjectCode";
import { ProjectCard } from "../../components/features/Home/ProjectCard";

export const ProjectListPage: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 4;

  const {
    data: projectResponse,
    error,
    isLoading,
    refetch: refetchProjects,
  } = useGetProjects({
    page: currentPage,
    size: projectsPerPage,
    sort: "createdAt,desc",
  });

  const { refetch: refetchSchedule } = useGetProjectDates();

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (projectResponse?.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleAddProject = async () => {
    await Promise.all([refetchProjects(), refetchSchedule()]);
    onClose();
  };

  const renderProjectSection = () => {
    if (isLoading) {
      return (
        <Center py={10}>
          <Text>프로젝트 목록을 불러오는 중...</Text>
        </Center>
      );
    }

    if (error) {
      return (
        <Center py={10}>
          <Text color="red.500">프로젝트 목록을 불러오는데 실패했습니다.</Text>
        </Center>
      );
    }

    if (!projectResponse?.resultData?.length) {
      return (
        <Center py={10}>
          <VStack spacing={4}>
            <Text color="gray.500" fontSize="lg">
              참여중인 프로젝트가 없습니다.
            </Text>
          </VStack>
        </Center>
      );
    }

    return (
      <Flex justifyContent="center" alignItems="center" gap={6} p={5}>
        <IconButton
          aria-label="Previous projects"
          icon={<ChevronLeftIcon />}
          onClick={handlePrevious}
          isDisabled={currentPage === 0}
        />

        <Flex gap={6}>
          {projectResponse.resultData.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.name}
              startDate={project.startDate}
              endDate={project.endDate}
              option={{
                type: project.optionIds.length === 2 ? "basic" : "custom",
              }}
              imageSrc={project.imageURL}
              refetch={refetchProjects}
              refetchSchedule={refetchSchedule}
            />
          ))}
        </Flex>

        <IconButton
          aria-label="Next projects"
          icon={<ChevronRightIcon />}
          onClick={handleNext}
          isDisabled={!projectResponse?.hasNext}
        />
      </Flex>
    );
  };

  return (
    <Box>
      <Box maxW="lg" mx="auto">
        <SearchInput placeholder="# 참여코드로 시작" height={50} width={50} />
      </Box>

      <Box mt={10}>
        <Flex alignItems="center" justifyContent="center" gap="800">
          <Text fontSize="20px" fontWeight="bold" mb={6}>
            프로젝트 목록
          </Text>

          <Button
            backgroundColor="#95A4FC"
            color="#FFFFFF"
            onClick={onOpen}
            leftIcon={<AddIcon />}
          >
            생성
          </Button>
        </Flex>

        {renderProjectSection()}

        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ProjectCreatingModal
              onClose={onClose}
              onProjectCreated={handleAddProject}
            />
          </ModalContent>
        </Modal>
      </Box>

      <Box maxW="1010" mx="auto" mb={10}>
        <ScheduleList />
      </Box>
    </Box>
  );
};

export default ProjectListPage;