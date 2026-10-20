import { Profile, BlogCategory, BlogTag, BlogPost, Project, SiteSettings } from "@/types";

export const initialSiteSettings: SiteSettings = {
  blog_title: "Engineering Journal",
  blog_subtitle: "Explorations, experiments, and technical deep-dives in robotics, modern control theory, embedded systems, and applied mathematics.",
  site_name: "Alex Rivera | Robotics & Embedded Systems",
  site_description: "Portfolio and technical engineering journal of a robotics and control systems engineer.",
};

export const initialProfile: Profile = {
  id: "profile-default",
  full_name: "Alex Rivera",
  headline: "Robotics Engineering Student | Embedded Systems | Control & Automation",
  bio: "Undergraduate robotics and mechatronics engineering student passionate about robust control theory, state-space estimation, real-time embedded firmware, and autonomous robotic platforms.",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  resume_url: "/resume.pdf",
  email: "alex.rivera.robotics@example.com",
  location: "Boston, MA / Remote",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  twitter_url: "https://x.com",
  interests: [
    "Autonomous Mobile Robots (AMR)",
    "State Estimation & Extended Kalman Filters",
    "Field Oriented Control (FOC) for BLDC Motors",
    "Real-Time Operating Systems (FreeRTOS)",
    "ROS 2 (Robot Operating System) & Gazebo",
    "Optimal Control & Model Predictive Control (MPC)"
  ],
  technical_skills: [
    {
      category: "Programming Languages",
      skills: ["C/C++ (Modern C++17/20)", "Python 3", "MATLAB / Simulink", "Rust", "TypeScript"]
    },
    {
      category: "Robotics & Control",
      skills: ["ROS 2 (Humble / Iron)", "State Space Control", "Kalman Filtering / EKF", "LQR / LQG", "PID Tuning", "Gazebo Sim", "URDF / TF2"]
    },
    {
      category: "Embedded & Hardware",
      skills: ["ARM Cortex-M (STM32)", "ESP32", "FreeRTOS", "CAN Bus / SPI / I2C / UART", "Altium Designer", "Oscilloscopes & Logic Analyzers"]
    },
    {
      category: "Software & DevOps",
      skills: ["Git & GitHub Actions", "Docker", "Linux (Ubuntu Server)", "CMake", "GDB Debugging"]
    }
  ],
  education: [
    {
      degree: "B.S. in Robotics Engineering & Computer Science",
      institution: "State University Institute of Technology",
      period: "2022 — Present (Expected May 2026)",
      gpa: "3.92 / 4.00",
      highlights: [
        "Head of Controls at Formula Student Electric Racing Team",
        "Undergraduate Research Assistant at Autonomous Systems & Controls Lab",
        "Dean's Honor List (All Semesters)"
      ]
    }
  ],
  experience: [
    {
      role: "Robotics Firmware Engineering Intern",
      organization: "Apex Motion Dynamics",
      period: "May 2024 — August 2024",
      description: "Engineered bare-metal CAN-FD communication drivers and trajectory generation algorithms on STM32H7 dual-core microcontrollers for high-speed industrial pick-and-place robots.",
      achievements: [
        "Reduced actuator synchronization jitter by 38% using FreeRTOS timer groups and DMA.",
        "Created an automated hardware-in-the-loop (HIL) testing harness with Python and pytest."
      ]
    },
    {
      role: "Undergraduate Controls Researcher",
      organization: "Precision Automation Lab",
      period: "September 2023 — Present",
      description: "Investigated nonlinear adaptive control and sliding mode control for flexible inverted pendulums and quadrupedal locomotion platforms.",
      achievements: [
        "Co-authored research paper on disturbance observer-based backstepping control.",
        "Implemented real-time sensor fusion with 9-DOF IMU and optical encoders at 1 kHz."
      ]
    }
  ],
  updated_at: new Date().toISOString()
};

export const initialCategories: BlogCategory[] = [
  {
    id: "cat-control",
    parent_id: null,
    name: "Control Theory",
    slug: "control-theory",
    description: "Classical and modern control systems, state estimation, stability proofs, and feedback control architectures.",
    display_order: 1,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cat-control-pid",
    parent_id: "cat-control",
    name: "PID Control",
    slug: "pid-control",
    description: "Anti-windup, derivative filtering, discrete implementations, and tuning methodologies.",
    display_order: 1,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-control-statespace",
    parent_id: "cat-control",
    name: "State Space",
    slug: "state-space",
    description: "Multivariable state-space representation, controllability, observability, and pole placement.",
    display_order: 2,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-control-optimal",
    parent_id: "cat-control",
    name: "Optimal Control",
    slug: "optimal-control",
    description: "Linear Quadratic Regulators (LQR), Pontryagin's Minimum Principle, and Model Predictive Control (MPC).",
    display_order: 3,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-robotics",
    parent_id: null,
    name: "Robotics",
    slug: "robotics",
    description: "Kinematics, dynamic modeling, spatial math, path planning, and ROS 2 ecosystem.",
    display_order: 2,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cat-robotics-kinematics",
    parent_id: "cat-robotics",
    name: "Robot Kinematics",
    slug: "robot-kinematics",
    description: "Forward and inverse kinematics, Denavit-Hartenberg parameters, and Lie algebra/SO(3)/SE(3).",
    display_order: 1,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-robotics-planning",
    parent_id: "cat-robotics",
    name: "Motion Planning",
    slug: "motion-planning",
    description: "Trajectory generation, RRT*, A*, trajectory optimization, and collision avoidance.",
    display_order: 2,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-embedded",
    parent_id: null,
    name: "Embedded Systems",
    slug: "embedded-systems",
    description: "Low-level firmware, microcontrollers, real-time architectures, communication protocols, and motor drivers.",
    display_order: 3,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cat-embedded-rtos",
    parent_id: "cat-embedded",
    name: "FreeRTOS",
    slug: "freertos",
    description: "Real-time task scheduling, semaphores, queues, and priority inversion prevention.",
    display_order: 1,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-embedded-sensors",
    parent_id: "cat-embedded",
    name: "Sensors & Fusion",
    slug: "sensors",
    description: "IMUs, encoders, optical flow, and sensor fusion algorithms.",
    display_order: 2,
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "cat-math",
    parent_id: null,
    name: "Mathematics",
    slug: "mathematics",
    description: "Applied linear algebra, matrix calculus, differential equations, and probability for roboticists.",
    display_order: 4,
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const initialTags: BlogTag[] = [
  { id: "tag-cplusplus", name: "C++", slug: "cpp", created_at: "2024-01-01T00:00:00Z" },
  { id: "tag-python", name: "Python", slug: "python", created_at: "2024-01-01T00:00:00Z" },
  { id: "tag-matlab", name: "MATLAB", slug: "matlab", created_at: "2024-01-01T00:00:00Z" },
  { id: "tag-stm32", name: "STM32", slug: "stm32", created_at: "2024-01-01T00:00:00Z" },
  { id: "tag-ros2", name: "ROS 2", slug: "ros2", created_at: "2024-01-01T00:00:00Z" },
  { id: "tag-kalman", name: "Kalman Filter", slug: "kalman-filter", created_at: "2024-01-01T00:00:00Z" },
  { id: "tag-lqr", name: "LQR", slug: "lqr", created_at: "2024-01-01T00:00:00Z" }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Understanding Linear Quadratic Regulators (LQR) from First Principles",
    slug: "understanding-lqr-from-first-principles",
    description: "A mathematically rigorous yet intuitive guide to deriving the continuous-time Algebraic Riccati Equation and implementing optimal state feedback in modern control systems.",
    cover_image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
    category_id: "cat-control-optimal",
    status: "published",
    is_featured: true,
    reading_time_minutes: 8,
    published_at: "2025-01-15T09:00:00Z",
    created_at: "2025-01-14T10:00:00Z",
    updated_at: "2025-01-15T09:00:00Z",
    content_markdown: `## Introduction to Optimal Control

In classical control, we tune PID controllers using empirical techniques like Ziegler-Nichols or root locus analysis. However, when dealing with **multi-input multi-output (MIMO)** systems, such as a quadrotor or a self-balancing inverted pendulum, classical loop shaping becomes exceptionally tedious.

The **Linear Quadratic Regulator (LQR)** provides an automated, mathematically optimal approach to stabilizing a linear dynamical system while balancing state error against actuation effort.

### System Formulation

Consider a continuous-time linear time-invariant (LTI) system defined by:

$$
\\dot{x}(t) = A x(t) + B u(t)
$$

where:
- $x(t) \\in \\mathbb{R}^n$ represents the state vector
- $u(t) \\in \\mathbb{R}^m$ represents the control input vector
- $A \\in \\mathbb{R}^{n \\times n}$ is the system matrix
- $B \\in \\mathbb{R}^{n \\times m}$ is the input matrix

### The Quadratic Cost Function

We want to find a feedback control law $u(t) = -K x(t)$ that drives the state to zero while minimizing the infinite-horizon quadratic performance index:

$$
J = \\int_0^\\infty \\left( x(t)^T Q x(t) + u(t)^T R u(t) \\right) dt
$$

Here, the design matrices are:
1. $Q \\ge 0$ (positive semi-definite) penalizes deviations of the state variables.
2. $R > 0$ (positive definite) penalizes aggressive control effort to protect our actuators.

### The Algebraic Riccati Equation (ARE)

Using dynamic programming and Pontryagin's Minimum Principle, the optimal gain matrix $K$ is given by:

$$
K = R^{-1} B^T P
$$

where $P$ is the unique symmetric positive-definite solution to the continuous-time **Algebraic Riccati Equation**:

$$
A^T P + P A - P B R^{-1} B^T P + Q = 0
$$

### Control Architecture Diagram

\`\`\`mermaid
flowchart LR
    Ref[Reference r=0] --> Sub(( - ))
    Sub --> Controller["Optimal Gain K"]
    Controller -->|Control Input u| Plant["System Dynamics: x_dot = Ax + Bu"]
    Plant -->|State x| Feedback[Sensor Feedback]
    Feedback --> Sub
\`\`\`

### Python Implementation with NumPy & SciPy

Here is a practical Python script to compute the LQR gain matrix using \`scipy.linalg.solve_continuous_are\`:

\`\`\`python
import numpy as np
from scipy.linalg import solve_continuous_are

def compute_lqr(A: np.ndarray, B: np.ndarray, Q: np.ndarray, R: np.ndarray):
    """
    Computes the continuous-time LQR controller gain K:
    u = -K * x
    """
    # Solve Continuous Algebraic Riccati Equation
    P = solve_continuous_are(A, B, Q, R)
    
    # Compute optimal feedback gain
    K = np.linalg.inv(R) @ B.T @ P
    
    # Check closed-loop eigenvalues for stability
    A_cl = A - B @ K
    eigvals = np.linalg.eigvals(A_cl)
    
    return K, P, eigvals

if __name__ == "__main__":
    # Inverted pendulum linearized model
    g = 9.81
    l = 0.5
    m = 0.2
    M = 1.0
    
    A = np.array([
        [0, 1, 0, 0],
        [0, 0, -(m * g) / M, 0],
        [0, 0, 0, 1],
        [0, 0, ((M + m) * g) / (M * l), 0]
    ])
    
    B = np.array([
        [0],
        [1 / M],
        [0],
        [-1 / (M * l)]
    ])
    
    Q = np.diag([10.0, 1.0, 100.0, 10.0])
    R = np.array([[0.1]])
    
    K, P, eigvals = compute_lqr(A, B, Q, R)
    print("Optimal Gain K:", K)
    print("Closed-loop poles:", np.round(eigvals, 3))
\`\`\`

### Conclusion

LQR guarantees infinite gain margin and at least $60^\\circ$ of phase margin for single-input systems when full state feedback is available. In the next article, we will pair LQR with a Kalman Filter to form an **LQG (Linear-Quadratic-Gaussian)** controller for realistic noisy sensors.`
  },
  {
    id: "post-2",
    title: "Designing a Deterministic FreeRTOS Task Architecture for Robotics",
    slug: "designing-deterministic-freertos-architecture",
    description: "How to prevent priority inversion, minimize context switching overhead, and structure hard real-time motor control loops on ARM Cortex-M microcontrollers.",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    category_id: "cat-embedded-rtos",
    status: "published",
    is_featured: false,
    reading_time_minutes: 6,
    published_at: "2025-01-28T14:30:00Z",
    created_at: "2025-01-27T11:00:00Z",
    updated_at: "2025-01-28T14:30:00Z",
    content_markdown: `## Real-Time Constraints in Robotics

When controlling brushless motors at 10 kHz or running an IMU sensor fusion loop at 1 kHz, an unexpected 5-millisecond delay can destabilize the control loop and cause catastrophic mechanical damage.

In this guide, we explore how to construct a deterministic **FreeRTOS** architecture on STM32 microcontrollers.

### Task Priority Hierarchy

A robust robotics firmware architecture organizes tasks strictly according to deadlines rather than execution length:

| Task Name | Frequency | Priority | Description |
|---|---|---|---|
| **FOC Current Loop** | 10 kHz | Hardware ISR | Direct timer triggering ADC |
| **Velocity & Position Loop** | 1 kHz | High (\`configMAX_PRIORITIES - 1\`) | Reads encoder, computes PID |
| **Telemetry & State Logging** | 50 Hz | Medium | Packets over CAN / USB |
| **Heartbeat & Diagnostics** | 2 Hz | Low | Watchdog refresh, LED blink |

### Priority Inversion Mitigation

\`\`\`c
// Safe mutex acquisition with Priority Inheritance enabled
SemaphoreHandle_t xMotorMutex = NULL;

void vMotorControlInit(void) {
    // Create a mutex (uses priority inheritance by default in FreeRTOS)
    xMotorMutex = xSemaphoreCreateMutex();
    configASSERT(xMotorMutex != NULL);
}

void vHighPriorityTask(void *pvParameters) {
    for (;;) {
        // Block until next period
        vTaskDelayUntil(&xLastWakeTime, xFrequency);

        if (xSemaphoreTake(xMotorMutex, pdMS_TO_TICKS(5)) == pdTRUE) {
            // Update PWM registers directly
            TIM1->CCR1 = calculate_duty_cycle();
            xSemaphoreGive(xMotorMutex);
        }
    }
}
\`\`\`

### Hardware Architecture

\`\`\`mermaid
flowchart TD
    Encoder[Quadrature Encoder] -->|TIMx Interface| MCU[STM32 Microcontroller]
    IMU[6-Axis IMU via SPI DMA] --> MCU
    MCU -->|PWM Signals| Inverter[3-Phase Gate Driver]
    Inverter --> Motor[BLDC Motor]
\`\`\`

With proper priority inheritance and DMA offloading, the CPU remains free to handle complex trajectory interpolation without timing jitter.`
  },
  {
    id: "post-3",
    title: "Deriving Forward & Inverse Kinematics for a 6-DOF Robotic Manipulator",
    slug: "deriving-kinematics-6dof-robotic-manipulator",
    description: "Step-by-step breakdown of Denavit-Hartenberg (D-H) parameter assignments, homogeneous transformation matrices, and analytical inverse kinematics solutions.",
    cover_image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    category_id: "cat-robotics-kinematics",
    status: "published",
    is_featured: false,
    reading_time_minutes: 10,
    published_at: "2025-02-05T16:00:00Z",
    created_at: "2025-02-04T12:00:00Z",
    updated_at: "2025-02-05T16:00:00Z",
    content_markdown: `## Forward Kinematics with D-H Parameters

To compute the end-effector pose of a robotic manipulator from its joint angles $\\theta_1, \\theta_2, \\dots, \\theta_n$, we assign coordinate frames according to standard **Denavit-Hartenberg (DH)** conventions.

Each link transformation is parameterized by four scalars:
1. Joint angle $\\theta_i$ (rotation around $z_{i-1}$)
2. Link offset $d_i$ (translation along $z_{i-1}$)
3. Link length $a_i$ (translation along $x_i$)
4. Link twist $\\alpha_i$ (rotation around $x_i$)

### The General Transformation Matrix

$$
^{i-1}T_i = \\begin{bmatrix}
\\cos\\theta_i & -\\sin\\theta_i\\cos\\alpha_i & \\sin\\theta_i\\sin\\alpha_i & a_i\\cos\\theta_i \\\\
\\sin\\theta_i & \\cos\\theta_i\\cos\\alpha_i & -\\cos\\theta_i\\sin\\alpha_i & a_i\\sin\\theta_i \\\\
0 & \\sin\\alpha_i & \\cos\\alpha_i & d_i \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

The overall end-effector pose relative to the base frame is the chained matrix multiplication:

$$
^0T_6 = \\prod_{i=1}^6 {}^{i-1}T_i = {}^0T_1 \\cdot {}^1T_2 \\cdot {}^2T_3 \\cdot {}^3T_4 \\cdot {}^4T_5 \\cdot {}^5T_6
$$

### C++ Forward Kinematics Solver using Eigen

\`\`\`cpp
#include <iostream>
#include <Eigen/Dense>
#include <cmath>

Eigen::Matrix4d dh_matrix(double theta, double d, double a, double alpha) {
    Eigen::Matrix4d T;
    double ct = std::cos(theta);
    double st = std::sin(theta);
    double ca = std::cos(alpha);
    double sa = std::sin(alpha);

    T << ct, -st * ca,  st * sa, a * ct,
         st,  ct * ca, -ct * sa, a * st,
          0,       sa,       ca,      d,
          0,        0,        0,      1;
    return T;
}

int main() {
    double q1 = 0.0, q2 = M_PI_4, q3 = -M_PI_4;
    
    Eigen::Matrix4d T01 = dh_matrix(q1, 0.2, 0.0, M_PI_2);
    Eigen::Matrix4d T12 = dh_matrix(q2, 0.0, 0.4, 0.0);
    Eigen::Matrix4d T23 = dh_matrix(q3, 0.0, 0.3, 0.0);
    
    Eigen::Matrix4d T03 = T01 * T12 * T23;
    
    std::cout << "End-effector Position (x, y, z):\\n"
              << T03.block<3, 1>(0, 3) << std::endl;
    return 0;
}
\`\`\`
`
  }
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Apex-Arm: 6-DOF Robotic Manipulator with ROS 2 & Gazebo",
    slug: "apex-arm-6dof-robotic-manipulator",
    short_description: "Custom 3D-printed and CNC aluminum 6-axis robotic arm with cycloidal gearboxes, closed-loop stepper actuators, and MoveIt 2 motion planning.",
    cover_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    github_url: "https://github.com",
    demo_url: "https://youtube.com",
    status: "published",
    is_featured: true,
    tech_tags: ["ROS 2", "MoveIt 2", "C++", "FreeRTOS", "Cycloidal Drives", "CAN Bus"],
    specifications: {
      "Degrees of Freedom": "6 Axis Articulated",
      "Payload Capacity": "1.2 kg at full reach",
      "Maximum Reach": "650 mm",
      "Repeatability": "±0.15 mm",
      "Actuator Type": "Closed-loop NEMA 17/23 with 14-bit magnetic encoders",
      "Communication": "CAN-FD @ 5 Mbps"
    },
    published_at: "2025-01-20T10:00:00Z",
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2025-01-20T10:00:00Z",
    content_markdown: `## Project Summary

The **Apex-Arm** project is an open-source, high-precision 6-DOF robotic manipulator designed for research in trajectory optimization and visual servoing.

### System Architecture

The robot utilizes a distributed control topology:
- **High-level host:** Ubuntu 22.04 running ROS 2 Humble and MoveIt 2 for kinematic planning and collision checking.
- **Low-level joint controllers:** Custom STM32G4-based servo boards communicating over a synchronized CAN-FD bus.

\`\`\`mermaid
flowchart TD
    Host["ROS 2 Host (PC) / MoveIt 2"] -->|CAN-FD Bus| Joint1["Joint 1: Base Yaw (STM32)"]
    Host -->|CAN-FD Bus| Joint2["Joint 2: Shoulder Pitch"]
    Host -->|CAN-FD Bus| Joint3["Joint 3: Elbow Pitch"]
    Joint3 --> Joint4["Joint 4-6: Spherical Wrist"]
\`\`\`

### Key Innovations
- **3D-Printed 25:1 Cycloidal Reducers:** Zero-backlash design with custom eccentric bearing shafts.
- **Dynamic Gravity Compensation:** Real-time Newton-Euler inverse dynamics running at 500 Hz on the microcontrollers.`
  },
  {
    id: "proj-2",
    title: "NavBot-SLAM: Autonomous Mobile Robot with LiDAR & EKF",
    slug: "navbot-slam-autonomous-mobile-robot",
    short_description: "Differential drive autonomous ground vehicle equipped with 2D LiDAR, stereo camera, and Extended Kalman Filter sensor fusion for GPS-denied navigation.",
    cover_image_url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80",
    github_url: "https://github.com",
    status: "published",
    is_featured: true,
    tech_tags: ["Python", "ROS 2 Nav2", "Slamtec RPLiDAR", "EKF", "ESP32", "OpenCV"],
    specifications: {
      "Chassis": "Differential Drive (Aluminum 3mm)",
      "Max Velocity": "1.4 m/s",
      "Sensors": "RPLiDAR A1M8, Intel RealSense D435, 9-DOF BNO085 IMU",
      "Compute": "NVIDIA Jetson Orin Nano + ESP32 Sub-controller"
    },
    published_at: "2024-11-15T08:00:00Z",
    created_at: "2024-11-01T08:00:00Z",
    updated_at: "2024-11-15T08:00:00Z",
    content_markdown: `## Overview

NavBot is a modular autonomous mobile robot built to test state estimation and path planning in cluttered indoor environments without GPS.`
  },
  {
    id: "proj-3",
    title: "FOC-Drive: Brushless DC Motor Controller with Field Oriented Control",
    slug: "foc-drive-bldc-motor-controller",
    short_description: "Custom 4-layer PCB motor inverter capable of 48V 30A with Clarke/Park transforms, Space Vector PWM (SVPWM), and inline phase current sensing.",
    cover_image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    github_url: "https://github.com",
    status: "published",
    is_featured: false,
    tech_tags: ["Altium Designer", "STM32F4", "C", "SVPWM", "Hardware Design", "Power Electronics"],
    specifications: {
      "Input Voltage": "12V — 48V DC",
      "Continuous Current": "30A RMS with heatsink",
      "Peak Current": "60A (5 seconds)",
      "Switching Frequency": "20 kHz Space Vector PWM",
      "Current Sensing": "Dual inline shunts with TI INA240 amplifiers"
    },
    published_at: "2024-09-10T11:00:00Z",
    created_at: "2024-08-15T11:00:00Z",
    updated_at: "2024-09-10T11:00:00Z",
    content_markdown: `## Hardware Design

Designed using Altium Designer, the power stage features six low-RDS(on) N-channel MOSFETs in a compact half-bridge configuration.`
  }
];
