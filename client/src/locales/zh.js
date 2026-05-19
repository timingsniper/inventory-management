export default {
  // Navigation
  nav: {
    overview: "概览",
    inventory: "库存",
    orders: "订单",
    finance: "财务",
    demandForecast: "需求预测",
    reports: "报告",
    backlog: "积压",
    restocking: "补货",
    companyName: "催化剂组件",
    subtitle: "库存管理系统",
  },

  // Dashboard
  dashboard: {
    title: "概览",
    kpi: {
      title: "关键绩效指标",
      inventoryTurnover: "库存周转率",
      ordersFulfilled: "已完成订单",
      orderFillRate: "订单完成率",
      revenue: "收入（订单）",
      revenueYTD: "收入（订单）年初至今",
      revenueMTD: "收入（订单）月初至今",
      avgProcessingTime: "平均处理时间（天）",
      goal: "目标",
    },
    summary: {
      title: "摘要",
    },
    orderHealth: {
      title: "订单状况",
      totalOrders: "总订单数",
      revenue: "收入",
      avgOrderValue: "平均订单金额",
      onTimeRate: "准时率",
      avgFulfillmentDays: "平均完成天数",
      total: "合计",
    },
    ordersByMonth: {
      title: "按月订单数",
    },
    inventoryValue: {
      title: "按类别库存价值",
    },
    inventoryShortages: {
      title: "库存短缺",
      noShortages: "无库存短缺 - 所有订单均可完成！",
      noData: "所选筛选条件无数据",
      orderId: "订单ID",
      sku: "SKU",
      itemName: "产品名称",
      quantityNeeded: "所需数量",
      quantityAvailable: "可用数量",
      shortage: "短缺",
      daysDelayed: "延误天数",
      priority: "优先级",
      unitsShort: "件短缺",
      days: "天",
    },
    topProducts: {
      title: "按收入排名的热销产品",
      sku: "SKU",
      product: "产品",
      category: "类别",
      warehouse: "仓库",
      stockStatus: "库存状态",
      revenue: "收入",
      unitsOrdered: "已订数量",
      firstOrder: "首次订单",
      inStock: "有库存",
      lowStock: "库存不足",
    },
  },

  // Inventory
  inventory: {
    title: "库存",
    description: "追踪和管理所有库存产品",
    stockLevels: "库存水平",
    skus: "SKU",
    searchPlaceholder: "按产品名称搜索...",
    clearSearch: "清除搜索",
    exportCsv: "导出CSV",
    totalItems: "总产品数",
    totalValue: "总价值",
    lowStockItems: "低库存产品",
    warehouses: "仓库",
    table: {
      sku: "SKU",
      itemName: "产品名称",
      name: "名称",
      category: "类别",
      warehouse: "仓库",
      quantity: "数量",
      quantityOnHand: "现有数量",
      reorderPoint: "再订购点",
      unitCost: "单位成本",
      unitPrice: "单价",
      totalValue: "总价值",
      location: "位置",
      status: "状态",
    },
  },

  // Orders
  orders: {
    title: "订单",
    description: "查看和管理客户订单",
    allOrders: "所有订单",
    restockingOrders: "已提交的补货订单",
    totalOrders: "总订单数",
    totalRevenue: "总收入",
    avgOrderValue: "平均订单金额",
    onTimeDelivery: "准时交付",
    itemsCount: "{count}件",
    quantity: "数量",
    table: {
      orderNumber: "订单号",
      orderId: "订单ID",
      orderDate: "订单日期",
      date: "日期",
      customer: "客户",
      category: "类别",
      warehouse: "仓库",
      items: "产品",
      value: "金额",
      totalValue: "总金额",
      status: "状态",
      expectedDelivery: "预计交付日期",
      actualDelivery: "实际交付日期",
    },
  },

  // Finance/Spending
  finance: {
    title: "财务仪表板",
    description: "追踪收入、成本和财务绩效",
    totalRevenue: "总收入",
    totalCosts: "总成本",
    netProfit: "净利润",
    avgOrderValue: "平均订单金额",
    fromOrders: "来自{count}笔订单",
    costBreakdown: "采购 + 运营 + 劳动力 + 间接费用",
    margin: "利润率",
    perOrderRevenue: "每笔订单收入",
    revenueVsCosts: {
      title: "月度收入对比成本",
      revenue: "收入",
      costs: "总成本",
    },
    monthlyCostFlow: {
      title: "月度成本流",
      procurement: "采购",
      operational: "运营",
      labor: "劳动力",
      overhead: "间接费用",
    },
    categorySpending: {
      title: "按类别支出",
      ofTotal: "占总额",
    },
    transactions: {
      title: "最近交易",
      id: "ID",
      description: "描述",
      vendor: "供应商",
      date: "日期",
      amount: "金额",
    },
  },

  // Demand Forecast
  demand: {
    title: "需求预测",
    description: "分析需求趋势和预测",
    increasingDemand: "需求增加",
    stableDemand: "需求稳定",
    decreasingDemand: "需求减少",
    itemsCount: "{count}件",
    more: "更多...",
    demandForecasts: "需求预测",
    table: {
      sku: "SKU",
      itemName: "产品名称",
      currentDemand: "当前需求",
      forecastedDemand: "预测需求",
      change: "变化",
      trend: "趋势",
      period: "周期",
    },
  },

  // Filters
  filters: {
    timePeriod: "时间段",
    location: "位置",
    category: "类别",
    orderStatus: "订单状态",
    all: "全部",
    allMonths: "所有月份",
  },

  // Statuses
  status: {
    delivered: "已交付",
    shipped: "已发货",
    processing: "处理中",
    backordered: "缺货待补",
    inStock: "有库存",
    lowStock: "库存不足",
    adequate: "充足",
  },

  // Trends
  trends: {
    increasing: "增加",
    stable: "稳定",
    decreasing: "减少",
  },

  // Priority
  priority: {
    high: "高",
    medium: "中",
    low: "低",
  },

  // Categories
  categories: {
    circuitBoards: "电路板",
    sensors: "传感器",
    actuators: "执行器",
    controllers: "控制器",
    powerSupplies: "电源",
  },

  // Spending Categories
  spendingCategories: {
    rawMaterials: "原材料",
    components: "零部件",
    equipment: "设备",
    consumables: "消耗品",
  },

  // Warehouses
  warehouses: {
    sanFrancisco: "旧金山",
    london: "伦敦",
    tokyo: "东京",
  },

  // Months
  months: {
    jan: "1月",
    feb: "2月",
    mar: "3月",
    apr: "4月",
    may: "5月",
    jun: "6月",
    jul: "7月",
    aug: "8月",
    sep: "9月",
    oct: "10月",
    nov: "11月",
    dec: "12月",
    january: "一月",
    february: "二月",
    march: "三月",
    april: "四月",
    june: "六月",
    july: "七月",
    august: "八月",
    september: "九月",
    october: "十月",
    november: "十一月",
    december: "十二月",
  },

  // Profile Menu
  profile: {
    profileDetails: "个人资料详情",
    myTasks: "我的任务",
    logout: "退出登录",
  },

  // Profile Details Modal
  profileDetails: {
    title: "个人资料详情",
    email: "邮箱",
    department: "部门",
    location: "位置",
    phone: "电话",
    joinDate: "入职日期",
    employeeId: "员工ID",
    close: "关闭",
  },

  // Tasks Modal
  tasks: {
    title: "我的任务",
    taskTitle: "任务标题",
    taskTitlePlaceholder: "输入任务标题...",
    priority: "优先级",
    dueDate: "截止日期",
    addTask: "添加任务",
    noTasks: "暂无任务。请在上方添加您的第一个任务！",
  },

  // Language
  language: {
    english: "英语",
    japanese: "日语",
    simplifiedChinese: "简体中文",
    korean: "韩语",
    selectLanguage: "选择语言",
  },

  // Restocking
  restocking: {
    title: "补货",
    description: "根据需求预测推荐并订购产品",
    budgetLabel: "可用预算",
    recommendations: "推荐产品",
    noRecommendations: "在此预算范围内没有需要补货的产品",
    placeOrder: "下订单",
    orderSuccess: "补货订单已成功提交",
    orderError: "补货订单提交失败",
    totalCost: "总费用",
    of: "/",
    table: {
      name: "产品名称",
      sku: "SKU",
      trend: "趋势",
      currentStock: "当前库存",
      qtyToOrder: "订购数量",
      unitCost: "单位成本",
      subtotal: "小计",
    },
  },

  // Backlog
  backlog: {
    title: "积压管理",
    description: "追踪和解决库存短缺",
    highPriority: "高优先级",
    mediumPriority: "中优先级",
    lowPriority: "低优先级",
    totalItems: "积压总数",
    cardTitle: "积压产品",
    noItems: "无积压 - 所有订单均可完成！",
  },

  // Reports
  reports: {
    title: "绩效报告",
    subtitle: "查看季度绩效指标和月度趋势",
    quarterlyPerformance: "季度绩效",
    monthlyRevenueTrend: "月度收入趋势",
    monthOverMonthAnalysis: "环比分析",
    table: {
      quarter: "季度",
      totalOrders: "总订单数",
      totalRevenue: "总收入",
      avgOrderValue: "平均订单金额",
      fulfillmentRate: "完成率",
      month: "月份",
      orders: "订单数",
      revenue: "收入",
      change: "变化",
      growthRate: "增长率",
    },
    stats: {
      totalRevenueYTD: "年初至今总收入",
      avgMonthlyRevenue: "平均月度收入",
      totalOrdersYTD: "年初至今总订单数",
      bestQuarter: "最佳绩效季度",
    },
  },

  // Common
  common: {
    loading: "加载中...",
    error: "错误",
    noData: "无可用数据",
    viewDetails: "查看详情",
    close: "关闭",
    save: "保存",
    cancel: "取消",
    search: "搜索",
    filter: "筛选",
    export: "导出",
    items: "件",
  },

  // Product Names
  productNames: {
    "Single Layer PCB Assembly": "单层PCB组件",
    "Dual Layer PCB Assembly": "双层PCB组件",
    "Multi Layer PCB Assembly": "多层PCB组件",
    "Temperature Sensor Module": "温度传感器模块",
    "Humidity Sensor Module": "湿度传感器模块",
    "Pressure Sensor Module": "压力传感器模块",
    "Proximity Sensor": "接近传感器",
    "Ultrasonic Distance Sensor": "超声波距离传感器",
    "Micro Servo Motor": "微型伺服电机",
    "Standard Servo Motor": "标准伺服电机",
    "Stepper Motor NEMA 17": "步进电机NEMA 17",
    "8-bit Microcontroller": "8位微控制器",
    "32-bit ARM Microcontroller": "32位ARM微控制器",
    "Digital Signal Processor": "数字信号处理器",
    "3-Axis Accelerometer": "三轴加速度计",
    "Gyroscope Module": "陀螺仪模块",
    "Light Dependent Resistor": "光敏电阻",
    "Coil Spring Heavy Duty": "重型螺旋弹簧",
    "Compression Spring": "压缩弹簧",
    "PWM Motor Controller": "PWM电机控制器",
    "H-Bridge Motor Driver": "H桥电机驱动器",
    "Stepper Motor NEMA 23": "步进电机NEMA 23",
    "Drive Pulley": "驱动滑轮",
    "LED Driver IC": "LED驱动IC",
    "5V 10A Switching Power Supply": "5V 10A开关电源",
    "12V 5A Power Supply Module": "12V 5A电源模块",
    "24V 3A Industrial Power Supply": "24V 3A工业电源",
    "Dual Output ±15V Power Supply": "双输出±15V电源",
    "48V DC Power Supply Unit": "48V直流电源装置",
    "USB-C PD 100W Power Supply": "USB-C PD 100W电源",
    "Battery Backup Power Supply": "备用电池电源",
    "Adjustable Bench Power Supply": "可调台式电源",
  },

  // Customer Names
  customerNames: {
    "Internal Restock": "内部补货",
    "MegaCorp Industries": "大企业工业",
    "Elite Systems Corp": "精英系统公司",
    "Horizon Technologies": "地平线科技",
    "FastAssembly Ltd": "快速装配有限公司",
    "TechSolutions Group": "技术解决方案集团",
    "Apex Engineering": "顶峰工程",
    "Superior Manufacturing": "优质制造",
    "Cascade Manufacturing": "级联制造",
    "Acme Manufacturing Corp": "艾克米制造公司",
    "TechBuild Industries": "技术建造工业",
    "Advanced Components Inc": "先进零部件公司",
    "Premier Industries": "顶级工业",
    "Stellar Components Ltd": "星际组件有限公司",
    "Dynamic Systems Ltd": "动态系统有限公司",
  },
};
