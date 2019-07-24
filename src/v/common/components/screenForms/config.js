function formatDate(time) {
  if (time) {
    var date = new Date(time);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  } else {
    return '';
  }
};
export const screenConfig = [{
  title: "发票号", //表单label
  type: "input", //表单类型
  key: "invoiceNo", ///表单关键字，页面中传这个
  placeholder: "请输入发票号", //占位提示
}, {
  title: "申请单ID",
  type: "input",
  key: "textCode",
  placeholder: "请输入申请单ID",
}, {
  title: "购买方名称",
  type: "input",
  key: "buyerName",
  placeholder: "请输入购买方名称",
}, {
  title: "签单人",
  type: "input",
  key: "single",
  placeholder: "请输入签单人",
}, {
  title: "快递单号",
  type: "input",
  key: "corierNo",
  placeholder: "请输入快递单号",
}, {
  title: "邮递日期",
  type: "date",
  key: "corierDate",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //申请单列表
  title: "申请日期",
  type: "date",
  key: "startDate",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //申请单列表
  type: "date",
  key: "endDate",
  className: "endDate",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //发票管理列表
  title: "开票日期",
  type: "date",
  key: "startDate_invoice",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //发票管理列表
  type: "date",
  key: "endDate_invoice",
  className: "endDate",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //专票冲红列表、预开审核列表
  title: "申请日期",
  type: "date",
  key: "startDate_create",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //专票冲红列表、预开审核列表
  type: "date",
  key: "endDate_create",
  className: "endDate",
  handleData: function(data) {
    return formatDate(data.getTime());
  }
}, { //预开审核列表状态
  title: "申请状态",
  type: "select",
  key: "auditState",
  api: "invoice.dictionary", //请求的api名
  placeholder: "请选择",
  handleData: function(data) { //处理数据的方法
    return data.invoiceAuditStateList;
  }
}, {
  title: "发票状态",
  type: "select",
  key: "state",
  api: "invoice.dictionary", //请求的api名
  placeholder: "请选择",
  handleData: function(data) { //处理数据的方法
    return data.invoiceStateList;
  }
}, {
  title: "开票状态",
  type: "select",
  key: "recState",
  api: "invoice.dictionary", //请求的api名
  placeholder: "请选择",
  handleData: function(data) { //处理数据的方法
    return data.invoiceBillingStateList;
  }
}, {
  title: "状态",
  type: "select",
  key: "redState",
  api: "invoice.dictionary", //请求的api名
  placeholder: "请选择",
  handleData: function(data) { //处理数据的方法
    return data.invoiceRedStateList;
  }
}, {
  title: "开票组织",
  type: "select",
  key: "openrecCom",
  api: "invoice.dictionary", //请求的api名 orgClassCode
  placeholder: "请选择",
  handleData: function(data) { //处理数据的方法
    return data.orgList;
  }
}, {
  title: "打印状态",
  type: "select",
  key: "printState",
  api: "invoice.dictionary", //请求的api名
  placeholder: "请选择",
  handleData: function(data) { //处理数据的方法
    return data.invoicePrintList;
  }
}, {
  title: "发票类型",
  type: "select",
  key: "invoiceType",
  api: "invoice.dictionary", //请求的api名
  placeholder: "请选择开票类型",
  handleData: function(data) { //处理数据的方法
    return data.invoiceTypeList;
  }
}, {
  title: "客户名称", //表单label
  type: "autocomplete", //表单类型
  params: { custName: '' }, //接口传递参数
  key: "custId", ///表单关键字，页面中传这个
  placeholder: "请输入客户", //占位提示
  api: "invoice.findSolrList", //请求的api名
  handleData: function(data) { //处理数据的方法
    let arr = [];
    for (let i in data.list) {
      arr.push({ value: data.list[i].custName, id: data.list[i].id })
    }
    return arr;
  }
}, {
  title: "所属分司", //表单label
  type: "tree", //表单类型
  key: "subId", ///表单关键字，页面中传这个
  isParent: false, //是否可以选中父级节点true:可选，false:不可选
  nodeType: 'SUB', //HQ("总部"), AREA("区域"), SUB("分公司"), DEPT("部门")
  placeholder: "请选择所属分司", //占位提示
  api: "invoice.findAllOrg", //请求的api名
  params: function() {
    let routePath = this.$route.path
    let ids = {
      '/invoice/invoice-list': 'ftree_invoice_list',
      '/invoice/apply-list': 'ftree_invoice_req_list',
      '/invoice/ticket-flush': 'ftree_invoice_flush'
    }
    return {id:ids[routePath]}
  },
  handleData: function(data) { //处理数据的方法
    return data.data;
  }
}, ]
