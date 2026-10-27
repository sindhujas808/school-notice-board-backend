package com.school.noticeboard.dto.request;

import com.school.noticeboard.enums.EngagementType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementRequest {

    @NotNull(message = "Notice ID is required")
    private Long noticeId;

    @NotNull(message = "Engagement type is required")
    private EngagementType engagementType;
}
