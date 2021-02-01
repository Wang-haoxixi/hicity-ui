import request from "@/router/axios";

const prefixUrl = "/admin/industry";
/**
 * 分类树
 * @param params (无意义)
 */
export const getIndustryTree = (params) => {
  return request({
    url: `${prefixUrl}/search_similar_name`,
    method: "get",
    params,
  });
};
/**
 * 新增分类
 * @param data 分类DTO
 */
export const addIndustry = (data) => {
  return request({
    url: `${prefixUrl}/insertOrUpdate`,
    method: "post",
    data,
  });
};
/**
 * 修改分类
 * @param data 分类DTO
 */
export const updateIndustry = (data) => {
  return request({
    url: `${prefixUrl}/insertOrUpdate`,
    method: "post",
    data,
  });
};
/**
 * 删除分类
 * @param id 分类ID
 */
export const delIndustryById = (id) => {
  return request({
    url: `${prefixUrl}/deleteIndustry/${id}`,
    method: "post",
  });
};
/**
 * 通过编码获取
 * @param number 分类编码
 */
export const getIndustryTreeByNumber = (number, params) => {
  return request({
    url: `${prefixUrl}/children/${number}`,
    method: "get",
    params,
  });
};
