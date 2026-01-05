import 'package:dotech_customer/features/discovery/domain/entities/service.dart';

class ServiceModel extends Service {
  const ServiceModel({
    required super.id,
    required super.categoryId,
    required super.name,
    required super.description,
    required super.basePrice,
    required super.pricingModel,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] ?? '',
      categoryId: json['categoryId'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      basePrice: (json['basePrice'] as num?)?.toDouble() ?? 0.0,
      pricingModel: json['pricingModel'] ?? 'fixed',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'categoryId': categoryId,
      'name': name,
      'description': description,
      'basePrice': basePrice,
      'pricingModel': pricingModel,
    };
  }
}
