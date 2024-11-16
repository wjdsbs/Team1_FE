import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import styled from "@emotion/styled";
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { MoreVertical } from "lucide-react";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteProject } from "../../../../api/hooks/useDeleteProject";

type ProjectOption = {
  type: "basic" | "custom";
  customOption?: {
    celebrationEffect: boolean;
    colorChange: boolean;
    emailNotification: boolean;
  };
};

type Props = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  option: ProjectOption;
  imageSrc?: string;
  width?: number | string;
  height?: number | string;
  onDeleteSuccess?: () => void;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  refetchSchedule: (options?: RefetchOptions) => Promise<QueryObserverResult>;
};

export const ProjectCard: React.FC<Props> = ({
  id,
  title,
  startDate,
  endDate,
  imageSrc,
  width,
  height,
  onDeleteSuccess,
  refetch,
  refetchSchedule,
}) => {
  const navigate = useNavigate();
  const { mutate: deleteProject } = useDeleteProject();

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    deleteProject(
      { projectId: id },
      {
        onSuccess: async () => {
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
          await Promise.all([refetch(), refetchSchedule()]);
        },
        onError: (error) => {
          console.error("Delete project error:", error);
        },
      }
    );
  }, [deleteProject, id, onDeleteSuccess, refetch, refetchSchedule]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.menu-container')) {
      return;
    }
    navigate(`/projects/${id}`);
  }, [navigate, id]);

  return (
    <Wrapper
      width={width}
      height={height}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <ImageArea>
        {imageSrc ? (
          <StyledImage src={imageSrc} alt="" />
        ) : (
          <PurpleBackground />
        )}
      </ImageArea>
      <MenuContainer className="menu-container">
        <Menu>
          <MenuButton as={SettingsButton}>
            <MoreVertical size={16} />
          </MenuButton>
          <MenuList
            minW="120px"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.100"
            zIndex={10}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem
              onClick={handleDelete}
              color="red.500"
            >
              삭제
            </MenuItem>
          </MenuList>
        </Menu>
      </MenuContainer>
      <TextArea>
        <Title>{title}</Title>
        <DateInfo>
          {new Date(startDate).toLocaleDateString()} -{" "}
          {new Date(endDate).toLocaleDateString()}
        </DateInfo>
      </TextArea>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  width?: number | string;
  height?: number | string;
}>`
  width: ${(props) => props.width || "253px"};
  height: ${(props) => props.height || "161px"};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 2px solid #95a4fc;
    outline-offset: 2px;
  }
`;

const ImageArea = styled.div`
  width: 100%;
  height: 70%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PurpleBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d9d9ff;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
`;

const SettingsButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: black;
  padding: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
`;

const TextArea = styled.div`
  height: 30%;
  background: white;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DateInfo = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default ProjectCard;