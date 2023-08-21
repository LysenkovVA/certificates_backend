export interface DomainModelMapper<D, M> {
    toDomain(model: M): D;
    toModel(domain: D): M;
}
