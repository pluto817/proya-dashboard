import csv
import random
import os

# 输入文件路径
input_file = r'c:\Users\邓慧文\Desktop\珀莱雅可视化大屏\data\数据集\珀莱雅用户数据整合总表.csv'
# 输出文件路径（覆盖原文件）
output_file = input_file

# 读取现有数据
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)  # 读取表头
    existing_data = list(reader)

# 统计现有数据量
existing_count = len(existing_data)
print(f"现有数据量: {existing_count}")

# 目标数据量
target_count = 5000

# 分析现有数据分布
genders = [row[1] for row in existing_data]
age_ranges = [int(row[2]) for row in existing_data if row[2]]
membership = [row[4] for row in existing_data]
rfm_categories = [row[5] for row in existing_data if row[5]]

# 如果现有数据量不足，生成新数据
if existing_count < target_count:
    new_count = target_count - existing_count
    print(f"需要生成的新数据量: {new_count}")
    
    # 生成新数据
    new_data = []
    for i in range(new_count):
        # 生成用户ID
        user_id = f"U{str(existing_count + i + 1).zfill(8)}"
        
        # 随机选择性别（保持现有分布）
        gender = random.choice(genders) if genders else '女'
        
        # 随机生成年龄（保持现有分布）
        age = random.choice(age_ranges) if age_ranges else random.randint(18, 65)
        
        # 肤质（保持为空，与现有数据一致）
        skin_type = ""
        
        # 随机选择会员状态（保持现有分布）
        member = random.choice(membership) if membership else '否'
        
        # 随机选择RFM分类（保持现有分布）
        rfm = random.choice(rfm_categories) if rfm_categories else '潜力发展用户'
        
        # 聚类（保持为空，与现有数据一致）
        cluster = ""
        
        new_data.append([user_id, gender, age, skin_type, member, rfm, cluster])
    
    # 合并现有数据和新数据
    all_data = existing_data + new_data
else:
    # 如果现有数据量超过目标，随机采样到目标数量
    print(f"现有数据量超过目标，随机采样到{target_count}条")
    all_data = random.sample(existing_data, target_count)
    # 更新用户ID以保持连续
    for i, row in enumerate(all_data):
        row[0] = f"U{str(i + 1).zfill(8)}"

# 保存到文件
with open(output_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(all_data)

print(f"数据处理完成！最终数据量: {len(all_data)}")
print(f"文件已保存到: {output_file}")