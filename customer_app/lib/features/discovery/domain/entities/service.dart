import 'package:equatable/equatable.dart';

class Service extends Equatable {
  final String id;
  final String categoryId;
  final String name;
  final String description;
  final double basePrice;
  final String pricingModel;

  const Service({
    required this.id,
    required this.categoryId,
    required this.name,
    required this.description,
    required this.basePrice,
    required this.pricingModel,
  });

  @override
  List<Object> get props => [id, name, basePrice];
}
